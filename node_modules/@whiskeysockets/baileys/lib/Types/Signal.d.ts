import { proto } from '../../WAProto';
declare type DecryptGroupSignalOpts = {
    group: string;
    authorJid: string;
    msg: Uint8Array;
};
declare type ProcessSenderKeyDistributionMessageOpts = {
    item: proto.Message.ISenderKeyDistributionMessage;
    authorJid: string;
};
declare type DecryptSignalProtoOpts = {
    jid: string;
    type: 'pkmsg' | 'msg';
    ciphertext: Uint8Array;
};
declare type EncryptMessageOpts = {
    jid: string;
    data: Uint8Array;
};
declare type EncryptGroupMessageOpts = {
    group: string;
    data: Uint8Array;
    meId: string;
};
declare type PreKey = {
    keyId: number;
    publicKey: Uint8Array;
};
declare type SignedPreKey = PreKey & {
    signature: Uint8Array;
};
declare type E2ESession = {
    registrationId: number;
    identityKey: Uint8Array;
    signedPreKey: SignedPreKey;
    preKey: PreKey;
};
declare type E2ESessionOpts = {
    jid: string;
    session: E2ESession;
};
export declare type SignalRepository = {
    decryptGroupMessage(opts: DecryptGroupSignalOpts): Promise<Uint8Array>;
    processSenderKeyDistributionMessage(opts: ProcessSenderKeyDistributionMessageOpts): Promise<void>;
    decryptMessage(opts: DecryptSignalProtoOpts): Promise<Uint8Array>;
    encryptMessage(opts: EncryptMessageOpts): Promise<{
        type: 'pkmsg' | 'msg';
        ciphertext: Uint8Array;
    }>;
    encryptGroupMessage(opts: EncryptGroupMessageOpts): Promise<{
        senderKeyDistributionMessage: Uint8Array;
        ciphertext: Uint8Array;
    }>;
    injectE2ESession(opts: E2ESessionOpts): Promise<void>;
    jidToSignalProtocolAddress(jid: string): string;
};
export {};
