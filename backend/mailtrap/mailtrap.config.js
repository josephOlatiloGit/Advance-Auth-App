import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// MailTrap config Function:
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Chimozuki",
};

/**
 * const recipients = [
  {
    email: "olatilojoseph@gmail.com",
  },
];

// config function:
client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    html: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
 */
