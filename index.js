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

// When clients are ready
iclient.on('connected', () => {
    console.log('[INSTA] Logged in')
})

dclient.on('ready', () => {
    console.log(`[DISCORD] Logged in as ${dclient.user.tag}`)
})

// Create an event listener for messages
iclient.on('messageCreate', message => {
    if (message.authorID == iclient.user.id) {
        return
    }

    // If the message is "ping"
    message.markSeen()
    if (message.content === 'ping') {
        // Reply "pong"
        message.reply('pong')
    }
	
	if (message.chatID === process.env.INSTA_CHAT_ID) {            
            hook.setUsername(message.author.fullName)
            hook.setAvatar(message.author.avatarURL)
            if (message.type == 'text') {
                hook.send(message.content)
            } else if (message.type == 'raven_media') {
                let mes = '*Contenu non supporté. Veuillez ouvrir l\'application Instagram pour y accéder.*'
                hook.send(mes)
            } else if (message.type == 'voice_media') {
                hook.send(message.voiceData.sourceURL);
            } else if (message.type == 'media') {
                hook.send(message.mediaData.url);
            } else if (message.type == 'like') {
                hook.send(':heart:')
            }
	}
})

dclient.on('message', msg => {
    if (msg.author.id == dclient.user.id) {
        return
    }

    // If the message is "ping"
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }

    // If the message is in the selected channel
	    if (msg.channel.id == process.env.DISCORD_CHANNEL_ID) {
            let nickm;
            msg.channel.guild.members.fetch(msg.author.id)
                .then(function(result) {
                    if (result.nickname == null) {
                        nickm = msg.author.username
                    } else {
                        nickm = result.nickname
                    }
                })
            
	    	iclient.fetchChat(process.env.INSTA_CHAT_ID).then((chat) => {
                if (msg.content != '') {
                    chat.sendMessage(`${nickm} : ${msg.content}`);
                }
                for (const [key, value] of msg.attachments.entries()) {
                    if (eval(`msg.attachments.get('${key}').height`) == null) {
                        let name = eval(`msg.attachments.get('${key}').name`);
                        let url = eval(`msg.attachments.get('${key}').url`);
                        let omessage = `Fichier envoyé par ${nickm} : ${name}\n${url}`;
                        chat.sendMessage(omessage);
                    } else {
                        let omessage = `Image envoyée par ${nickm} :`;
                        chat.sendMessage(omessage);
                        chat.sendPhoto(eval(`msg.attachments.get('${key}').url`));
                    }
                }
		})
	    }
})

// Login to Discord and Instagram
iclient.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWD)
dclient.login(process.env.DISCORD_BOT_TOKEN)
