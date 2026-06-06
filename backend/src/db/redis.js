import { createClient } from "redis";
import { ENV } from "../utils/env.js";

const client = createClient({
  url: ENV.REDIS_URL,
});
await client.connect();

export async function publishMessage(channel, message) {
  try {
    const numRecipients = await client.publish(
      channel,
      JSON.stringify(message),
    );
  } catch (err) {
    console.error(`error publishing message to channel ${channel}: `, err);
  }
}

export async function subscriber(channel) {
  try {
    await client.subscribe(channel, (message, channel) => {
      const channelMsg = JSON.parse(message);
      console.log(`Response Object: ${channelMsg}`);
    });
    console.log(`Subscribed to channel: ${channelName}`);
  } catch (err) {
    console.error(`Error subscribing to channel ${channel}: `, err);
  }
}
