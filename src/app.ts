import express from 'express';
import fetch from 'node-fetch';
import twilio from 'twilio';

type MessageResponseBody = {
    message: string;
};

const app = express();
const apiServer = process.env.API_SERVER;
const jsonHeader = 'application/json';

const urlEncodedMiddleware = express.urlencoded({ extended: false });
//const jsonMiddleware = express.json();

app.post('/call', urlEncodedMiddleware, (_req, res) => {
    const voiceResponse = new twilio.twiml.VoiceResponse();

    voiceResponse.say(
        'Text Trivia only supports SMS messaging. If you would like to stop receiving messages, please reply with the word stop to this number. Thank you.'
    );

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(voiceResponse.toString());
});

app.post('/message', urlEncodedMiddleware, async (req, res) => {
    const message = (req.body.Body as string) ?? '';

    let responseMessage: string;
    try {
        const apiResponse = await fetch(`${apiServer}response`, {
            method: 'POST',
            headers: {
                Accept: jsonHeader,
                'Content-Type': jsonHeader,
            },
            body: JSON.stringify({ message }),
        });

        const apiMsg = (await apiResponse.json()) as MessageResponseBody;

        responseMessage = apiMsg.message;
    } catch {
        responseMessage =
            'We are currently experiencing technical difficulties. Sorry for an inconvenience caused! - TextTrivia Team';
    }

    const messageResponse = new twilio.twiml.MessagingResponse();
    messageResponse.message(responseMessage);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(messageResponse.toString());
});

export default app;