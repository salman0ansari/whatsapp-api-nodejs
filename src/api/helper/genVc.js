module.exports = function generateVC(data) {
    const result =
        'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        `FN:${data.fullName}\n` +
        `ORG:${data.organization};\n` +
        `TEL;type=CELL;type=VOICE;waid=${data.phoneNumber}:${data.phoneNumber}\n` +
        'END:VCARD'

    return result
}
