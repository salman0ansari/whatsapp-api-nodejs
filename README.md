
# whatsapp-api-nodejs ⚡
>> A simple NodeJS Wrapper for [Baileys](https://github.com/adiwajshing/Baileys). 

• [Why use this?](#-why-use-this)
• [FAQs](#-faqs)
• [Legal](#-legal)
• [Contributing](#-contributing)
### [📃 /api-docs](https://api.mdsalman.tech/api-docs/)

### [🧐 Why use this?](#-why-use-this)
- 🌠 Fast : This project uses Baileys which does not require Selenium or any other browser to be interface with WhatsApp Web, it does so directly using a WebSocket. Not running Selenium or Chromimum saves you like half a gig of ram :/

- 🔑 Safe : Does not mess with user’s data


### [🤔 FAQs](#-faqs)

-  **❓ How do i run this thing?** 
	>- Download Node.js v14.0x or greater
	>- Clone repo and install packages `npm install`

-  **🤯 NPM scripts** 
	>- Run server without webhook. `npm run start`
	>- Run server with webhook. `npm run start:webhook`
	>- Run server with webhook + receive full size data in response. `npm run start:fullsize`

-   **😕 How do I setup environment variables?** 
	> 1. Create a new file name it .env
	> 2. Copy/Paste your secrets in .env file - [.env Example](https://github.com/salman0ansari/whatsapp-api-nodejs/blob/main/.env.example ".env Example")
```
WEBHOOK_URL=https://webhook.site/123
WEBHOOK_KEY=
```

-  **❓ Where do i get WEBHOOK_URL from?** 
	> You can easily get a webhook for testing purpose from [webhook.site](https://webhook.site/ "webhook.site").

-  **🛠️ Is this app built with NodeJS?**
	> Yes, it's built with [NodeJS](https://nodejs.org/en/).
- **📦 What npm modules did you use?**
	>- [express](https://github.com/expressjs/express) for API Server.
	>- [baileys](https://github.com/adiwajshing/Baileys) for connecting to whatsapp web.

- **📥 How do I contact you?** 
	> If you find an issue, report it. Have questions? drop me a msg on telegram at [@salman0ansari](https://t.me/salman0ansari)


### [🧑🏻‍⚖️ Legal](#-legal)
- This code is in no way affiliated, authorized, maintained, sponsored or endorsed by WA(WhatsApp) or any of its affiliates or subsidiaries.
- The official WhatsApp website can be found at https://whatsapp.com. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners.
- This is an independent and unofficial software Use at your own risk.
- Do not spam people with this.

### [👥 Contributing](#-contributing) 
- Contributing is simple as cloning, making changes and submitting a pull request.
- If you would like to contribute, here are a few starters:
- Bug Hunts.
- More sorts of examples.
- Make code clean.
- Additional features/ More integrations.
- TS support.

#### Thanks to [Manjit](https://github.com/Manjit2003) for instance class.