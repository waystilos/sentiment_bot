require("dotenv").config();

const {
  WebClient,
  RTMClient,
  CLIENT_EVENTS,
  RTM_EVENTS
} = require('@slack/client');

const express = require('express');
const app = express();

const bot_token = process.env.SLACK_TOKEN;

const channelId = process.env.SLACK_CHANNEL_ID;

const appData = {};

const web = new WebClient(bot_token);

const rtm = new RTMClient(bot_token, {
    dataStore: true,
    useRtmConnect: true
});

rtm.on('message', (message) => {
    console.dir(message);
    rtm
        .sendMessage(`message sent to channel name: ${message.channel}`, channelId)
        .then(() => {
            getSlackText(message);
            console.log(`message sent to channel name: <${message.channel}>`);
        })
        .catch(console.error);
});

function getSlackText(message) {
    app.post('/sentiment', (req, res, next) => {
        console.log(message.text);
        res.send(message.text);
    });
}

rtm.start();
