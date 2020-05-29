## Install

First, clone the repo via git:

```bash
git clone https://github.com/Radicis/queuebunny.git
```

And then install the dependencies with yarn.

```bash
$ cd queuebunny
$ yarn
```

If it gives you any troule about chalk just do npm i chalk and try again

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ yarn dev
```

If you don't need autofocus when your files was changed, then run `dev` with env `START_MINIMIZED=true`:

```bash
$ START_MINIMIZED=true yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
$ yarn package
```
