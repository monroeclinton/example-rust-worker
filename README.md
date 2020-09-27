# example-react-rust

This is an example Rust project intended for [Cloudflare Workers](https://workers.cloudflare.com/).

## How to run

Clone this repo and cd into it.

Install [Wrangler](https://github.com/cloudflare/wrangler) and login to Cloudflare with `wrangler login`. You will also need to install Rust.

After you install Wrangler you need to initialize your site:

```
wrangler init --type webpack
npm install
```

Change the information in `wrangler.toml` with your credentials.

Next build the project with:

```
wrangler publish
```

To use this example rust worker, check out the [example react worker](https://github.com/monroeclinton/example-react-worker).

## License

example-react-worker is [MIT licensed](./LICENSE).
