
import
makeWASocket, {
    WASocket, ConnectionState,
    makeCacheableSignalKeyStore, DisconnectReason
} from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { toDataURL } from 'qrcode';
import pino from 'pino';
import BaileysBottle from "baileys-bottle";
import { Extra } from './misc/extra.entity.js';
import { DataSource } from "typeorm";
import { resolve, dirname } from 'path'

const SESSION_ID = 'whatsapp-session';

type Session = WASocket & {
    destroy: () => Promise<void>;
    getQr: () => Promise<string | null | undefined>;
    connectionState?: Partial<ConnectionState>
    loggedIn?: boolean;
};

type createSessionOptions = {
    sessionId: string;
    webhook?: string | null;
};

const sessions = new Map<string, Session>();
const __dirname = resolve(dirname(''));

// @ts-ignore
export let bottle = await BaileysBottle.default.init({
    type: "sqlite",
    database: "db.sqlite",
    entities: [Extra],
    synchronize: true,
})

export class createSession {

    logger: pino.Logger;
    sessionId: string;
    webhook: string;
    configID: string;
    sock!: WASocket | undefined;
    _ds: DataSource;

    constructor(options: createSessionOptions) {
        const { sessionId, webhook } = options;
        this.logger = pino({ prettyPrint: true });
        this.webhook = webhook!;
        this.sessionId = sessionId;
        this.configID = `${SESSION_ID}-${this.sessionId}`;
    }

    getQr = async () => {
        const extraEntity = await this._ds.getRepository(Extra).findOne({
            where: { key: this.sessionId },
        });
        return extraEntity?.qr;
    }

    destroy = async () => {
        await this.sock?.logout()
        sessions.delete(this.sessionId);
    };

    create = async () => {
        const { auth, store, _ds } = await bottle.createStore(this.sessionId)!;
        const { state, saveState } = await auth.useAuthHandle();
        this._ds = _ds;

        const entityExists = await this._ds.getRepository(Extra).findOne({
            where: { key: this.sessionId },
        });

        if (!entityExists) {
            this._ds.getRepository(Extra).insert({
                key: this.sessionId,
                qr: '',
                webhook: this.webhook,
            })
        }

        // @ts-ignore
        const sock = makeWASocket.default({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, this.logger),
            },
            logger: this.logger,
        })
        this.sock = sock;
        sessions.set(this.sessionId, { ...sock, destroy: this.destroy, loggedIn: false, getQr: this.getQr });
        store.bind(sock.ev);
        sock.ev.process(async (events: any) => {

            if (events['messages.upsert']) {
                const upsert = events['messages.upsert']
                console.log('recv messages ', JSON.stringify(upsert, undefined, 2))
            }

            if (events["creds.update"]) await saveState();

            if (events["connection.update"]) {
                const update = events["connection.update"];
                const { connection, lastDisconnect, qr } = update;
                console.log(update)
                if (qr) {
                    const qrData = await toDataURL(qr);
                    await setExtraDB(this.sessionId, qrData, this.webhook, _ds);
                }

                connection === "open"
                    ? console.log("Connected")
                    : connection === "close"
                        ? (lastDisconnect?.error as Boom)?.output?.statusCode !==
                            DisconnectReason.loggedOut
                            ? this.create()
                            : console.log("Connection closed. You are logged out.")
                        : null;
                if (connection === "open") {
                    sessions.set(this.sessionId, { ...sock, destroy: this.destroy, connectionState: update, loggedIn: true, getQr: this.getQr });
                    await setExtraDB(this.sessionId, 'connected', this.webhook, _ds);
                }
            }
        });

        return this
    };
}

export function getSession(sessionId: string) {
    return sessions.get(sessionId);
}

export async function deleteSession(sessionId: string) {
    return sessions.get(sessionId)?.destroy();
}

export function sessionExists(sessionId: string) {
    return sessions.has(sessionId);
}

async function setExtraDB(sessionId: string, qr: string, webhook: string | null, _ds: any) {
    const extraEntity = await _ds.getRepository(Extra).findOne({
        where: { key: sessionId },
    });
    if (extraEntity) {
        extraEntity.qr = qr;
        extraEntity.webhook = webhook;
        await _ds.getRepository(Extra).save(extraEntity);
    }
}
