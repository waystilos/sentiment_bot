require("dotenv").config();

const {
  WebClient,
  RTMClient,
  CLIENT_EVENTS,
  RTM_EVENTS
} = require('@slack/client');

const request = require('request');

const express = require('express');
const app = express();

const NAGKUMAR_URL = process.env.URL;

const bot_token = process.env.SLACK_TOKEN;

const channelId = process.env.SLACK_CHANNEL_ID;

const appData = {};

const web = new WebClient(bot_token);

const rtm = new RTMClient(bot_token, {
    dataStore: true,
    useRtmConnect: true
});

function getSlackText(message) {
    request.post(NAGKUMAR_URL, { json: { text: message.text } }, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });
}

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

rtm.start();
