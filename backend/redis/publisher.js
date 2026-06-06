import { createClient } from "redis";
import { ENV } from "../src/utils/ENV.js";

export const publisher = createClient({ url: ENV.REDIS_URL });
publisher.on("error", (err) => {
  console.error(`Redis publisher error: ${err}`);
});
await publisher.connect();
