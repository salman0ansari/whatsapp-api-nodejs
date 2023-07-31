
export type ButtonDef = {
    type: string;
    title: string;
    payload: string; 
}

export type Button = { 
    quickReplyButton?: { displayText: any }; 
    callButton?: { displayText: any; phoneNumber: any }; 
    urlButton?: { displayText: any; url: any } 
}

export default function processButton(buttons?: ButtonDef[]) {
    const preparedButtons: Button[] = []

    buttons?.map((button) => {
        if (button.type == 'replyButton') {
            preparedButtons.push({
                quickReplyButton: {
                    displayText: button.title ?? '',
                },
            })
        }

        if (button.type == 'callButton') {
            preparedButtons.push({
                callButton: {
                    displayText: button.title ?? '',
                    phoneNumber: button.payload ?? '',
                },
            })
        }
        if (button.type == 'urlButton') {
            preparedButtons.push({
                urlButton: {
                    displayText: button.title ?? '',
                    url: button.payload ?? '',
                },
            })
        }
    })
    return preparedButtons
}
