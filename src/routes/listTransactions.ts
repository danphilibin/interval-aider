import { Action, io } from "@interval/sdk";
import stripe from "../utils/stripe";

export default new Action({
  name: "List Transactions",
  description: "List the most recent Stripe transactions",
  handler: async () => {
    const transactions = await stripe.charges.list({ limit: 10 });

    const formattedTransactions = transactions.data.map((transaction) => ({
      id: transaction.id,
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(transaction.amount / 100),
      date: new Date(transaction.created * 1000).toLocaleDateString(),
    }));

    await io.display.table("Recent Transactions", {
      data: formattedTransactions,
      columns: ["id", "amount", "date"],
    });
  },
});
