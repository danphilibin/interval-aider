# Interval app

_Note for humans: this is a subset of the full [Interval docs](https://interval.com/docs) optimized for instructing an AI agent how to build Interval apps._

---

This is an Interval application. Interval is a platform that lets you build interactive CLI-like scripts, just by writing backend TypeScript code.

Each Interval script is called an "action" and exists in its own file, one file per action. The entrypoint is src/index.ts. Actions are automatically loaded from the filesystem in src/routes.ts. Each action gets a slug according to its filename. For example, the slug for src/routes/helloWorld.ts is "helloWorld".

## Writing an Interval action

When you create a new Interval action, create a new file in the `src/routes` directory and give it a descriptive slug.

The file MUST export the following code:

```ts
import { Action, io } from "@interval/sdk";

export default new Action({
  name: "{{ACTION NAME}}",
  description: "{{ACTION DESCRIPTION}}",
  handler: async () => {
    // Your code here
  },
});
```

## How Interval works

With Interval, SDK methods - called "IO methods" - are used to collect input and display output within your business logic.

Here is a 'hello world' example:

```ts
import { Action, io } from "@interval/sdk";

export default new Action({
  name: "{{ACTION NAME}}",
  description: "{{ACTION DESCRIPTION}}",
  handler: async () => {
    // "io methods" are awaitable, pause execution, and display UI to the user
    const name = await io.input.text("What is your name?");

    // ...perform some business logic...
    const uppercaseName = name.toUpperCase();

    // user another "io method" to display output
    await io.display.markdown(`Your name in uppercase is \${uppercaseName}`);
  },
});
```

## Code guidelines

Code in this project MUST adhere to the following guidelines:

- Use the documented IO methods to collect input and display output. Do not use any methods other than those documented below.
- If an action requests multiple consecutive pieces of information (e.g. "ask for name and email"), use `io.group` to combine multiple inputs into a single step.
- Use ES6 import syntax.
- Write valid TypeScript code. Type fetched resources as `any` to avoid type errors.
- Assume `fetch` is available in the global scope.
- Use the documented validation methods if possible when adding advanced validation to inputs.

## Available IO methods

### text input

```ts
const text = await io.input.text(label: string, props?: {
  defaultValue?: string,
  placeholder?: string,
  helpText?: string, // adds additional instructions
  multiline?: boolean, // 'true' turns it into a textarea
  lines?: number, // number of textarea lines
  disabled?: boolean,
  placeholder?: boolean,
  minLength?: number,
  maxLength?: number,
})
```

Returns: `string`

### email input

```ts
const email = await io.input.email(label: string, props?: {
  defaultValue?: string,
  placeholder?: string,
  helpText?: string, // adds additional instructions
  disabled?: boolean,
})
```

Returns: `string`

### number input

```ts
const number = await io.input.number(label: string, props?: {
  defaultValue?: string,
  placeholder?: string,
  helpText?: string, // adds additional instructions
  currency?: string, // e.g. 'usd'
  disabled?: boolean,
  min?: number,
  max?: number,
})

```

Returns: `number`

### select single input

```ts
type Option = (string | { label: string; value: string })

const currency = await io.select.single(label: string, {
  options: Option[],
  defaultValue?: Option,
  disabled?: boolean,
  helpText?: string, // adds additional instructions
});

```

Returns: `Option` (either a string or a label/value object, whichever is used)

### select multiple input

```ts
type Option = (string | { label: string; value: string })

const currency = await io.select.multiple(label: string, {
  options: Option[],
  defaultValue?: Option,
  disabled?: boolean,
  helpText?: string, // adds additional instructions
  minSelections?: number,
  maxSelections?: number,
});

```

Returns: `Option[]` (either an array of strings or label/value objects, whichever is used)

### select from table input

Similar to `io.display.table`, but allows the user to select one or more rows from the table. Does not support the `getData` function.

```ts
const selection = await io.select.table(label: string, props?: {
  data: any[], // this is the data to be shown in the table
  columns?: string | ColumnDef[], // object keys from the `data` array OR column defs; will display all columns if none are provided
  rowMenuItems?: (row: T) => { // displays a dropdown menu for each row
    label: string;
    route?: string; // slug for linking to another action
    url?: string; // used for external URLs
    disabled?: boolean
    theme?: 'danger'
  }[]
  minSelections?: number,
  maxSelections?: number,
  initiallySelected?: T[], // array of rows to be selected by default
})
```

Returns: `T[]` (where `T` is the type of data provided to the table)

### boolean input

```ts
const isSelected = await io.input.boolean(label: string, props?: {
  defaultValue?: boolean,
  disabled?: boolean,
  helpText?: string, // adds additional instructions
})
```

Returns: `boolean`

### date input

```ts
// Important: note the return type of this method below
const date = await io.input.date(label: string, props?: {
  defaultValue?: Date | {
    year: number;
    month: number; // 1-12
    day: number;
  },
  disabled?: boolean,
  helpText?: string, // adds additional instructions
})
```

Returns object with the following structure:

```
{
  month: number,
  day: number,
  year: number,
  jsDate: Date,
}
```

### time input

```ts
// Important: note the return type of this method below
const time = await io.input.time(label: string, props?: {
  defaultValue?: Date | {
    hour: number; // 0-23
    minute: number; // 0-59
  },
  disabled?: boolean,
  helpText?: string, // adds additional instructions
})
```

Returns object with the following structure:

```
{
  hour: number,
  minute: number,
}
```

### datetime input

```ts
// Important: note the return type of this method below
const datetime = await io.input.datetime(label: string, props?: {
  defaultValue?: Date | {
    year: number;
    month: number; // 1-12
    day: number;
    hour: number; // 0-23
    minute: number; // 0-59
  },
  disabled?: boolean,
  helpText?: string, // adds additional instructions
  min?: Date | {
    year: number;
    month: number; // 1-12
    day: number;
    hour: number; // 0-23
    minute: number; // 0-59
  },
  max?: Date | {
    year: number;
    month: number; // 1-12
    day: number;
    hour: number; // 0-23
    minute: number; // 0-59
  },
})
```

Returns object with the following structure:

```
{
  month: number,
  day: number,
  year: number,
  hour: number,
  minute: number,
  jsDate: Date,
}
```

### slider input

Alternative to number input that displays a slider. Useful for selecting numbers within ranges.

```ts
const number = await io.input.slider(label: string, props?: {
  defaultValue?: number,
  min: number,
  max: number,
  step?: number,
  disabled?: boolean,
  helpText?: string, // adds additional instructions
})
```

Returns: `number`

### rich text input

Displays a WYSIWYG editor and returns HTML.

```ts
const html = await io.input.richText(label: string, props?: {
  defaultValue?: string,
  disabled?: boolean,
  placeholder?: string,
  helpText?: string, // adds additional instructions
})
```

Returns: `string`

### url input

```ts
const url = await io.input.url(label: string, props?: {
  defaultValue?: string,
  disabled?: boolean,
  placeholder?: string,
  helpText?: string, // adds additional instructions
  allowedProtocols?: string[], // e.g. ['http', 'https']
})
```

### file input

```ts
const file = await io.input.file(label: string, props?: {
  defaultValue?: string,
  disabled?: boolean,
  placeholder?: string,
  helpText?: string, // adds additional instructions
  allowedExtensions?: string[], // e.g. ['.jpg', '.png']

  // Optional function that generates presigned URLs for uploading and downloading files. Works with any S3-compatible API.
  generatePresignedUrls?: Promise<{ uploadUrl: string, downloadUrl: string }>,
})
```

Returns:

```
{
  extension: string
  lastModified: Date
  name: string
  size: number
  type: string
  buffer: Promise<Buffer>
  text: Promise<string>
  url: string
}
```

Note: the `url` property is a TEMPORARY URL that will expire after the action finishes. If you need to store the file, use the `generatePresignedUrls` function to generate a permanent URL and upload the file to your storage provider.

To upload multiple files, chain `.multiple()` to the end of the method.

### confirm input

Requests confirmation with yes/no buttons.

This method is NOT supported within an `io.group``.

```ts
const isConfirmed = await io.confirm(label: string, props?: {
  helpText?: string, // adds additional description of the action being taken
})
```

Returns: `boolean`

### confirm identity input

Like `io.confirm`, but requests multi-factor authentication or password confirmation of the person running the action.

This method is NOT supported within an `io.group``.

```ts
const isConfirmed = await io.confirmIdentity(label: string)
```

Returns: `boolean`

### search

Displays a typeahead search input that can be used to search through a list of results, including remotely fetched data.

```ts
const result = await io.search(label: string, props: {
  disabled?: boolean,
  helpText?: string, // adds additional instructions
  initialResults?: T[],
  renderResult: (row: T) => string | number | boolean | Date | {
    label: string,
    description?: string, // shown as smaller text
    image?: {
      url: string,
      size: "thumbnail" | "small" | "medium" | "large",
    },
  },
  // called whenever the search query changes; returns filtered results.
  // is capable of fetching data asynchronously and returning the results,
  // e.g. a search input that connects to a remote API.
  onSearch: async (query: string) => Promise<T[]>
});

```

Returns: \`T\` (the type of the \`initialResults\` array)

### table output

```ts
await io.display.table(label: string, props?: {
  data: any[], // this is the data to be shown in the table
  columns?: string | ColumnDef[], // object keys from the \`data\` array OR column defs; will display all columns if none are provided
  rowMenuItems?: (row: T) => { // displays a dropdown menu for each row
    label: string;
    route?: string; // used for internal links. slugs are constructed from filenames in the `routes` folder, e.g. routes/my-action.ts => /my-action.
    url?: string; // used for external URLs
    disabled?: boolean
    theme?: 'danger'
  }[]
})

// one of accessorKey or renderCell is required
type ColumnDef = {
  label: string;
  accessorKey?: string; // corresponds to a key in \`data\`
  renderCell?: (row) => {
    label: string; // the value shown in the table
    url?: string; // an optional URL
    highlightColor?: "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "gray"
    image?: {
      url?: string
      buffer?: Buffer
      alt?: string
      size?: "thumbnail" | "small" | "medium" | "large"
    }
  }
}
```

Returns: `void``

### markdown output

```ts
await io.display.markdown(text: string)
```

Returns: `void`

### heading output

```ts
await io.display.heading(heading: string, props?: {
  level?:  2 | 3 | 4, // defaults to 2
  description?: string,
  menuItems?: {
    label: string;
    route?: string; // slug for linking to another action
    url?: string; // used for external URLs
    disabled?: boolean
    theme?: 'danger'
  }[]
})
```

Returns: `void`

### object output

```ts
await io.display.object(label: string, props?: {
  data: any,
})
```

Returns: `void`

### html output

```ts
await io.display.html(label: string, props?: {
  html: string,
})
```

Returns: `void`

### code output

(can also be used to display a value that should be copied to the clipboard)

```ts
await io.display.code(label: string, props?: {
  code: string,
  language?: string,
})
```

### image output

```ts
await io.display.image(label: string, props?: {
  url: string,
  alt?: string,
  size?: "thumbnail" | "small" | "medium" | "large",
  buffer?: Buffer,
})
```

Returns: `void`

### link or button output

```ts
await io.display.link(label: string, props?: {
  url: string,
  theme?: 'primary' | 'secondary' | 'danger', // defaults to 'primary'
})
```

Returns: `void`

### metadata output

Displays a list or grid of key/value data.

```ts
type MetaItem = {
  // the item label
  label: string;
  // the item display text value
  value?: string | number | boolean | Date;
  // links the item to an external URL
  url?: string;
  // links the item to another action or page
  route?: string;
  // arbitrary key/value pairs to send to the linked route
  props?: Record<string, any>;
  // a visible image to be displayed in the cell
  // must contain either `url` or `buffer`
  image?: {
    // a URL to the image
    url?: string
    // a buffer containing the image contents
    buffer?: Buffer
    // the image alt tag
    alt?: string
    // the size of the image
    size?: "thumbnail" | "small" | "medium" | "large"
  }
}[]

await io.display.metadata(label: string, props?: {
  data: MetaItem[],
  layout: 'card' | 'list' | 'grid', // defaults to 'grid'
})
```

### Grouping inputs together

If the script calls for grouping multiple elements together in a single "step", use the `io.group` method:

```ts
// accepts an object of input/output methods and returns an object of the same shape. Example:
const { name, email } = await io.group({
  // you can use any of the input/output methods in this object
  name: io.input.text("Name"),
  email: io.input.email("Email"),
});
```

### Making inputs optional

All input methods are required by default. To make an input optional, chain the `.optional()` method on the end:

```ts
const name = await io.input.text("Name").optional();
```

`.optional()` must be chained on the input methods, not an `io.group()` and not on any other methods.

### Loading indicators

To display a loading indicator, import the `ctx` object from the Interval SDK and use it like so:

```ts
// start a loading indicator
await ctx.loading.start({
  label: string,
  itemsInQueue: number,
  description: string,
});

// update an active loading indicator
await ctx.loading.update({
  label: string,
  itemsInQueue: number,
  description: string,
});

// update the counter of an active loader (if using itemsInQueue)
await ctx.loading.completeOne();
```

### Redirecting

```ts
await ctx.redirect({
  route?: string; // slug for linking to another action
  url?: string; // used for external URLs
  params?: Record<string, any>; // arbitrary key/value pairs to send to the linked route
})
```

### Customizing submit buttons

Every "step" in an Interval action has a button that says "Continue". To change the text or add multiple choices,chain `.withChoices()` on any input method or an `io.group` to customize the submit button text:

```ts
type Choice = (string | { label: string; value: string; theme?: 'secondary' | 'danger' });

// IMPORTANT: using `.withChoices` changes the return siganture of the method you're using:
const { choice, returnValue } = await io.input.text("Name").withChoices(choices: Choice[]);

console.log(choice) // the value of the button that was clicked
console.log(returnValue) // the value of the input (this is an object if using `io.group``)
```

### Validation

IO methods perform basic validations out of the box. To add custom validation, chain `.validate()` on the end of any input method or an `io.group`:

```ts
const name = await io.input.text("Name").validate((value) => {
  if (value.length < 3) {
    return "Name must be at least 3 characters";
  }
});

// with a group:
const { name, email, age, includeDrinkTickets } = await io
  .group({
    name: io.input.text("Name"),
    email: io.input.email("Email").validate((email) => {
      if (!email.endsWith("@interval.com"))
        return "Only Interval employees are invited to the holiday party.";
    }),
    age: io.input.number("Age"),
    includeDrinkTickets: io.input.boolean("Include drink tickets?"),
  })
  .validate(({ age, includeDrinkTickets }) => {
    if (age < 21 && includeDrinkTickets)
      return "Attendees must be 21 years or older to receive drink tickets.";
  });
```

Validation functions can be `async` or return a Promise. If the validation function returns a string, the string will be displayed to the user as an error message.
