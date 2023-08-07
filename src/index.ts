import "dotenv/config";
import path from "path";
import { Interval } from "@interval/sdk";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      INTERVAL_API_KEY: string;
      STRIPE_API_KEY?: string;
    }
  }
}

const interval = new Interval({
  apiKey: process.env.INTERVAL_API_KEY,
  routesDirectory: path.resolve(__dirname, "routes"),
});

interval.listen();
