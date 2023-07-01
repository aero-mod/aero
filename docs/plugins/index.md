# Plugins

Hey! this page will walk you through how to get started with plugin development.

# What can a plugin do.

A plugin (as of `v0.0.0`) is a single-file module that can control, modify, and extend discord's functionality. You may be familiar with different plugin formats from client modifications such as [BetterDiscord](https://betterdiscord.app/), [Vencord](https://vencord.dev/), and [Replugged](https://replugged.dev/). Aero's plugin system is most resemblant to Vencord's, but with a few key differences.

# Getting started & Structure.

We're going to assume you're creating your plugin directly from the `/aero/plugins` directory. **This is not reccommended**, but it's the easiest way to get started with the pre-bundled typedefs.

Aero uses custom modules to let you write cleaner code. All plugins are transpiled at runtime so you can write in ts or tsx. The only requirement is that your plugin exports a default object that adheres to the structure we'll show you later on.

To get started, we'll create a plugin, say `myplugin.tsx` that looks like this:

```tsx
import { definePlugin } from 'aero/plugin';

export default definePlugin({
    id: 'myplugin',
    name: 'My Plugin',
    description: 'This is my first plugin!',
    version: '1.0.0',
    author: {
        name: 'My Name',
        id: 'my discord id'
    }
})
```

✨ Ta da! ✨ We've just made a valid plugin. Now, let's go over the structure of the plugin object.

```tsx
type Plugin = {
    id: string;
    name: string;
    description: string;
    author: Author | Author[];
    color?: string;
    self?: Record<string, unknown>;
    dependencies?: string[];
    patches?: Patch[];
    start?(): void;
    stop?(): void;
    settings?: SettingsOption[];
};
```

Look at that! We're only using a few of the properties, but we'll go over all of them.

