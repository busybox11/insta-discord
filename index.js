'use strict'

// Require dotenv
const dotenv = require('dotenv');
dotenv.config();

// Import the insta.js module
const Insta = require('@androz2091/insta.js')

// Import the Discord webhook module
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL)

// Create an instance of a Instagram client
const client = new Insta.Client()

/**
 * The connected event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Instagram
 */
client.on('connected', () => {
    console.log('[INSTA] Logged in')
})

// Create an event listener for messages
client.on('messageCreate', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
        // Reply "pong"
        message.reply('pong')
    }

    if (message.chatID === process.env.INSTA_CHAT_ID) {
    	hook.setUsername(message.author.fullName)
    	hook.setAvatar(message.author.avatarURL)
    	hook.send(message.content);
    }
})

// Log our bot in using Instagram credentials
client.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWD)
