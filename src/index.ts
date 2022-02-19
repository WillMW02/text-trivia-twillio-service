import 'dotenv/config';
import twilio from 'twilio';

const client = twilio();
const response = await client.numbers.request();

console.log(response);
