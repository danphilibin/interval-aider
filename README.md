# Interval x Aider

This project demos how you can instruct an AI agent to build interactive Node.js scripts (personal scripts, internal tools, etc) using [Interval](https://interval.com) and [`aider`](https://aider.chat), a command-line tool for writing and editing code with OpenAI's GPT models.

🚧 This is an experiment! The [documentation](./DOCS.md) provided to `aider` is a hand-written subset of the full [Interval docs](https://interval.com/docs/installation) and is optimized for instructing an AI agent how to build Interval apps.

Demo video:

https://github.com/danphilibin/interval-aider/assets/180350/6a5485dc-f7ec-4a9b-ae53-d71a5eeaf8d1

## Getting started

Clone this repository and install dependencies. Sign up for a free [Interval](https://interval.com) account and add your personal development key to a `.env` file as `INTERVAL_API_KEY`.

Next, follow the [Getting Started instructions](https://aider.chat/#getting-started) to install `aider` on your machine.

You'll need two terminal sessions. First, start the Interval dev server with the `dev` command:

```
yarn dev
```

In another terminal, run the `aider` command to start an `aider` session and add the documentation and existing source files to your repo:

```
yarn aider
```

_💡 As your project grows you may want to update the `aider` command to only add the docs, and then manually add the files you're working with using the `/add` command in `aider`._

## Writing code

Here are some prompts you can try:

- "Create an action that asks for your name and says hello"
- "Create an action that fetches the latest posts from Hacker News and displays them in a table"
- "Create an action that asks for name, email, and company, and creates a new customer in my Stripe account."

I've included the Stripe SDK in this repo to help demo building more advanced actions that work with 3rd party services, as I've found GPT-4 to be fairly capable while working with the Stripe SDK. Optionally add a Stripe API key as `STRIPE_API_KEY` in `.env` to interact with Stripe.

### Tips for working with `aider`

See the [Tips section](https://aider.chat/#tips) in the `aider` docs to learn how to work with `aider`. I've found these tips to be particularly useful:

> Large changes are best performed as a sequence of thoughtful bite sized steps, where you plan out the approach and overall design. Walk GPT through changes like you might with a junior dev. Ask for a refactor to prepare, then ask for the actual change. Spend the time to ask for code quality/structure improvements.

And:

> If your code is throwing an error, share the error output with GPT using /run or by pasting it into the chat. Let GPT figure out and fix the bug.

If something isn't working right, try running `tsc` within `aider`:

```
/run yarn tsc
```

`aider` will run the command and add the result to the chat output. If the compiler returns an error it will attempt to fix it.

### Questions and support

If you have questions or need help, join the [Interval Discord](https://interval.com/discord) and ask in the `#✋-help` channel.
