# Connect Contact Flow Builder

A JavaScript DSL and CLI tool for generating Amazon Connect Contact Flow configurations.

# Installation

```shell script
# Install with npm
npm i --save-dev connect-contact-flow-builder

# ...or with yarn
yarn add -D connect-contact-flow-builder
```

# Usage

First, define a Contact Flow:

**simpleGreeting.js**
```javascript
const { PlayPrompt, Disconnect } = require('connect-contact-flow-builder');

module.exports = (companyName) => {
  const mainNode = new PlayPrompt({ 
    text: `Welcome to ${companyName}!`,
  });
  const disconnect = new Disconnect();
  mainNode.setSuccessBranch(disconnect);

  return mainNode
};
```

Then, run `build-contact-flow` to generate a configuration JSON:

```shell script
build-contact-flow simpleGreeting.js "My Company" > simpleGreeting.json
```

Finally, import the generated JSON into Connect:

![Image of "Simple Greeting" flow in the Contact Flow Designer](./resources/simpleGreeting.png)

# API

See [API.md](API.md).

# License

This software is [MIT licensed](LICENSE).
