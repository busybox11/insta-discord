'use strict'

// Require dotenv
const dotenv = require('dotenv');
dotenv.config();

// Import the insta.js module
const Insta = require('@androz2091/insta.js')

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
})

// Log our bot in using Instagram credentials
client.login(process.env.INSTA_USERNAME, process.env.INSTA_PASSWD)
