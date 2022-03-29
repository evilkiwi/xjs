<div align="center">
    <a href="https://www.npmjs.com/package/@evilkiwi/xjs" target="_blank">
        <img src="https://img.shields.io/npm/v/@evilkiwi/xjs?style=flat-square" alt="NPM" />
    </a>
    <a href="https://discord.gg/XMrHXtN" target="_blank">
        <img src="https://img.shields.io/discord/123906549860139008?color=7289DA&label=discord&logo=discord&logoColor=FFFFFF&style=flat-square" alt="Discord" />
    </a>
    <img src="https://img.shields.io/npm/l/@evilkiwi/xjs?style=flat-square" alt="Apache-2.0" />
    <h3>XSplit Broadcaster XJS Client</h3>
</div>

`@evilkiwi/xjs` provides a simple hook which can be used to connect to and consume the XSplit Broadcaster XJS Plugin.

## Installation

This package is available via NPM:

```bash
yarn add @evilkiwi/xjs

# or

npm install @evilkiwi/xjs
```

## Usage

```typescript
import { xjs, Subscription } from '@evilkiwi/xjs';

const client = await xjs({ debug: true });

// Asynchronous requests.
const activeScene = await client.getActiveScene();

// Subscriptions.
client.events.on(Subscription.SceneChange, ({ id }: any) => {
    console.log(`Active Scene was changed to ${id}`);
});
client.subscribe(Subscription.SceneChange);
```

## To-do

- Fully type the responses and provided methods from XJS
- Allow running in NodeJS via `ws`
