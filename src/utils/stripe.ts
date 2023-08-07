import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "", {
  apiVersion: "2022-11-15",
});

export const isTestMode = (process.env.STRIPE_API_KEY ?? "").startsWith(
  "sk_test"
);

export default stripe;
