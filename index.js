require("dotenv").config();

const {
  WebClient,
  RTMClient,
  CLIENT_EVENTS,
  RTM_EVENTS
} = require('@slack/client');

const request = require('request');

const NAGKUMAR_URL = process.env.URL;

const bot_token = process.env.SLACK_TOKEN;

const channelId = process.env.SLACK_CHANNEL_ID;

const appData = {};

const web = new WebClient(bot_token);

const rtm = new RTMClient(bot_token, {
    dataStore: false,
    useRtmConnect: true
});

function getSlackText(message) {
    request.post(NAGKUMAR_URL, { json: { text: message.text } }, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
        console.log(`magnitude: ${body.magnitude} / score: ${body.score}`);
        sendMessage(body);
    }
  });
}

function sendMessage(body) {
    web.chat
      .postMessage({ channel: channelId, text: `Magnitude: ${body.magnitude} / Score: ${body.score}`})
      .then(res => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
}

rtm.on('message', (message) => {
    console.dir(message);
    if (message.bot_id !== 'BAR2QBDQE') {
        rtm
            .sendMessage(`Let's check your emotions...`, channelId)
            .then(() => {
                getSlackText(message);
            })
            .catch(console.error);
    }
});

rtm.start();
