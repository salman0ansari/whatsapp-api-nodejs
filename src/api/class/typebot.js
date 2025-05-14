const { default: axios } = require("axios");
const sleep = require("../helper/sleep");
const logger = require('pino')()

const mapButtonsAndIds = []

function giveMeTextButtonAndIGiveUId(textButton) {
    return mapButtonsAndIds.find((item) => item.formattedText === textButton)?.id
}

function addMapButton(id, formattedText) {
    const finded = mapButtonsAndIds.find((item) => item.formattedText === formattedText)
    if (finded) return
    mapButtonsAndIds.push({ id, formattedText })
}

function applyFormatting(element) {
    let text = '';

    if (element.text) {
        text += element.text;
    }

    if (element.children && element.type !== 'a') {
        for (const child of element.children) {
            text += applyFormatting(child);
        }
    }

    if (element.type === 'p' && element.type !== 'inline-variable') {
        text = text.trim() + '\n';
    }

    if (element.type === 'inline-variable') {
        text = text.trim();
    }

    if (element.type === 'ol') {
        text =
            '\n' +
            text
                .split('\n')
                .map((line, index) => (line ? `${index + 1}. ${line}` : ''))
                .join('\n');
    }

    if (element.type === 'li') {
        text = text
            .split('\n')
            .map((line) => (line ? `  ${line}` : ''))
            .join('\n');
    }

    let formats = '';

    if (element.bold) {
        formats += '*';
    }

    if (element.italic) {
        formats += '_';
    }

    if (element.underline) {
        formats += '~';
    }

    let formattedText = `${formats}${text}${formats.split('').reverse().join('')}`;

    if (element.url) {
        formattedText = element.children[0]?.text ? `[${formattedText}]\n(${element.url})` : `${element.url}`;
    }

    return formattedText;
}

class TypeBot {

    constructor(apiHost, typebotName, parent) {
        this.apiHost = apiHost;
        this.typebotName = typebotName;
        this.sessions = [];
        this.parent = parent;
    }

    static giveMeTextButtonAndIGiveUId(textButton) {
        return giveMeTextButtonAndIGiveUId(textButton)
    }

    getObjectToSave() {
        return {
            apiHost: this.apiHost,
            typebotName: this.typebotName,
        }
    }

    async startTypebot(payload) {
        const { message, remoteJid } = payload
        if (remoteJid === 'status@broadcast') return;

        logger.info(`startTypebot ${remoteJid}`)
        const session = this.findSession(remoteJid)
        if (!session) {
            await this.createNewSession(remoteJid)
        } else {
            await this.continueChat(session, message)
        }
    }

    clearSessions() {
        this.sessions = []
    }

    findSession(remoteJid) {
        return this.sessions.find((session) => session.remoteJid === remoteJid)
    }

    async continueChat(sessionData, message) {
        const urlTypebot = `${this.apiHost}/api/v1/sessions/${sessionData.sessionId}/continueChat`;
        const content = message
        const reqData = {
            message: content,
        };

        try {
            const request = await axios.post(urlTypebot, reqData, { timeout: 5000 })

            await this.sendWAMessage(
                sessionData.remoteJid,
                request.data.messages,
                request.data.input,
                request.data.clientSideActions,
            )
        } catch (error) {
            logger.error(error?.response?.data)
            if (error.name === 'AxiosError') {
                const errorData = error.response.data
                if (errorData.message = "Session not found.") {
                    this.clearSessions()   
                    await this.createNewSession(sessionData.remoteJid)
                    const session = this.findSession(sessionData.remoteJid)
                    setTimeout(async () => {
                        await this.continueChat(session, message)
                    }, 2000)
                    return
                }
            }
            this.clearSessions()
        }
    }

    async createNewSession(remoteJid) {
        const url = `${this.apiHost}/api/v1/typebots/${this.typebotName}/startChat`;
        const reqBody = {
            prefilledVariables: {}
        }

        try {
            const request = await axios.post(url, reqBody, { timeout: 5000 })

            if (request?.data?.sessionId) {
                const id = Math.floor(Math.random() * 10000000000).toString();
                this.sessions.push({
                    sessionId: request.data.sessionId,
                    customSessionId: `${id}-${request.data.sessionId}`,
                    status: 'opened',
                    createdAt: Date.now(),
                    remoteJid
                })

                await this.sendWAMessage(
                    remoteJid,
                    request.data.messages,
                    request.data.input,
                    request.data.clientSideActions,
                )

                return request.data.sessionId
            }
        } catch (error) {
            logger.error(error)
        }

        return null
    }

    async sendWAMessage(remoteJid, messages, input, clientSideActions) {
        this.processMessages(remoteJid, this.parent, messages, input, clientSideActions, applyFormatting)
            .catch((err) => {
                logger.error(err)
            })
    }

    async processMessages(remoteJid, instance, messages, input, clientSideActions, applyFormatting) {
        if (clientSideActions) {
            for (const clientActions of clientSideActions) {
                if (clientActions.type === 'wait') {
                    const time = clientActions.wait.secondsToWaitFor * 1000
                    logger.info(`awaiting ${time} seconds`)
                    await sleep(time)
                }
            }
        }

        for (const message of messages) {

            if (message.type === 'text') {
                let formattedText = '';
                for (const richText of message.content.richText) {
                    for (const element of richText.children) {
                        formattedText += applyFormatting(element);
                    }
                    formattedText += '\n';
                }

                formattedText = formattedText.replace(/\*\*/g, '').replace(/__/, '').replace(/~~/, '').replace(/\n$/, '');

                formattedText = formattedText.replace(/\n$/, '');
                logger.info(`typebot text response ${formattedText}`)

                await instance.sendTextMessage(remoteJid, formattedText)
            }

            if (message.type === 'image') {
                await instance.sendUrlMediaFile(
                    remoteJid,
                    message.content.url,
                    'image',
                    '',
                    'teste'
                )
            }

            if (message.type === 'video') {
                
                console.log(message)
                // url youtube
                console.log(message.content.type)
            }

            if (message.type === 'audio') {
                console.log(message)
            }
        }

        if (input) {
            if (input.type === 'choice input') {

                const items = input.items;

                for (const item of items) {
                    const formattedText = `▶️ ${item.content}\n`.replace(/\n$/, '')
                    addMapButton(item.id, formattedText)

                    await instance.sendButtonMessage(
                        remoteJid,
                        {
                            //text: '',
                            buttons: [
                                {
                                    type: "replyButton",
                                    title: formattedText
                                },
                            ]
                        }
                    )
                }

            }

            if (input.type === 'text input') {
                const label = input?.options?.labels?.placeholder || 'Sem titulo para o input definido'
                await instance.sendTextMessage(
                    remoteJid,
                    label
                )
            }

            if (input.type === 'phone number input') {
                const label = input?.options?.labels?.placeholder || 'Sem titulo para o input definido'
                await instance.sendTextMessage(
                    remoteJid,
                    label
                )
            }
            // email input
            console.log('input type', input.type)
        }
    }
}

module.exports = TypeBot;