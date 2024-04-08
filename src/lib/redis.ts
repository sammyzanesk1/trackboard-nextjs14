import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://eu1-classic-eft-39598.upstash.io",
  token: process.env.REDIS_KEY!,
});
