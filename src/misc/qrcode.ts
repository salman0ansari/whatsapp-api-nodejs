export function qrHTML(qrcode: string, session_key: string) {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WhatsApp QrCode</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            color: darkslategray;
            font-family: 'Poppins', sans-serif;

        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .container2 {
            display: flex;
            flex-direction: column;
            gap: 25px;
            align-items: flex-start;
        }

        h2 a {
            text-decoration: none;
            color: darkslategray;
        }
    </style>
</head>

<body>
    <div class="container">
        <div>
            <h1> Scan Code Below Using WhatsApp App<h1>
        </div>
        <div class="container2">
            <img src="${qrcode}" alt="" id="qrcode_box" />
            <div>
                <h2>
                    ${session_key}
                </h2>
            </div>
        </div>
    </div>
    </div>
</body>

</html>`
}