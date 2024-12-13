import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

export const initializeRedisClient = async () => {
  try {
    await redisClient.connect();
    logger.info("Redis client initialized successfully");
  } catch (err) {
    logger.error("Failed to initialize Redis client:", err);
  }
};

export default redisClient;