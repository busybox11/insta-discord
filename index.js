'use strict'

// Require dotenv
const dotenv = require('dotenv');
dotenv.config()

// Import insta.js
const Insta = require('@androz2091/insta.js')

// Import discord.js
const Discord = require('discord.js');
const dclient = new Discord.Client()

// Import the Discord webhook module
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

// Create an instance of a Instagram client
const iclient = new Insta.Client()

// Initialize message cache
let icache = null;
let dcache = null;

// When clients are ready
iclient.on('connected', () => {
    console.log('[INSTA] Logged in')
})

dclient.on('ready', () => {
    console.log(`[DISCORD] Logged in as ${dclient.user.tag}`)
})

// Create an event listener for messages
iclient.on('messageCreate', message => {
    // If the message is "ping"
    message.markSeen()
    if (message.content === 'ping') {
        // Reply "pong"
        message.reply('pong')
    }

    // If the message hasn't been sent using Discord
    if (message.content !== icache) {
	    if (message.chatID === process.env.INSTA_CHAT_ID) {
            hook.setUsername(message.author.fullName)
            hook.setAvatar(message.author.avatarURL)
            if (message.type == 'text') {
                hook.send(message.content)
                dcache = message.content;
            } else if (message.type == 'raven_media') {
                let mes = '*Contenu non supporté. Veuillez ouvrir l\'application Instagram pour y accéder.*'
                hook.send(mes)
                dcache = mes
            } else if (message.type == 'voice_media') {
                hook.send(message.voiceData.sourceURL);
                dcache = message.voiceData.sourceURL;
            } else if (message.type == 'media') {
                hook.send(message.mediaData.url);
                dcache = message.mediaData.url;
            } else if (message.type == 'like') {
                hook.send(':heart:')
                dcache = ':heart:'
            }
	    }
	}
})

dclient.on('message', msg => {
    // If the message is "ping"
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }

    // If the message is in the selected channel
    if (msg.content !== dcache) {
	    if (msg.channel.id == process.env.DISCORD_CHANNEL_ID) {
	    	iclient.fetchChat(process.env.INSTA_CHAT_ID).then((chat) => {
                if (msg.content != '') {
                    chat.sendMessage(`${msg.author.username} : ${msg.content}`);
                    icache = `${msg.author.username} : ${msg.content}`
                }
                for (const [key, value] of msg.attachments.entries()) {
                    if (eval(`msg.attachments.get('${key}').height`) == null) {
                        let name = eval(`msg.attachments.get('${key}').name`);
                        let url = eval(`msg.attachments.get('${key}').url`);
                        let omessage = `Fichier envoyé par ${msg.author.username} : ${name}\n${url}`;
                        chat.sendMessage(omessage);
                        icache = omessage;
                    } else {
                        let omessage = `Image envoyée par ${msg.author.username} :`;
                        chat.sendMessage(omessage);
                        icache = omessage;
                        chat.sendPhoto(eval(`msg.attachments.get('${key}').url`));
                    }
                }
			})
	    }
	}
})

// Login to Discord and Instagram
iclient.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWD)
dclient.login(process.env.DISCORD_BOT_TOKEN)
