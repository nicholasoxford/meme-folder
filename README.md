# Welcome to MMFLDR (MEME FOLDER)!

- The easiest way to upload and track your memes.

## Tech Stack

- [Bun](https://bun.sh/docs)
- [Remix](https://remix.run/docs)
- CDN: [Cloudflare R2](https://developers.cloudflare.com/r2/)
- UI: [Shadcn and Tailwind](https://shadcn.com/)
- Database: [Cloudflare D1](https://developers.cloudflare.com/d1/)
- Authentication: [Supabase](https://supabase.io/)
- Deployed via [Cloudflare Pages](https://developers.cloudflare.com/pages)

## Local Development

When you run dev locally, it serves the Remix app through wrangler.

```sh
# start the remix dev server and wrangler
bun run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788)

> Note: You need to add a .dev.vars in the root

```md
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
R2_PUBLIC_URL=""
```

## Deployment

```sh
bun run pages:deploy
```

## Database

> D1 is a sqlite DB

#### Create an empty migration file

```sh
bun run create:migration
```

#### Run all migrations on local DB

```sh
bun run local:migrate
```

#### Run all migrations on Prod DB

```sh
bun run remote:migrate
```

## Known issues

R2 uploading does work locally

### Knowledge base

`server.ts`

> When you use anything besides the default remix server, you need to create this file. In our case it does server magic to change your remix app into a single cloudflare worker.

> Your Remix Project will generate a functions/[[path]].js file the first time you run remix dev or remix build. The [[path]] filename indicates that this file will handle requests to all incoming URLs. Refer to Path segments to learn more. Source: [**Cloudflare Pages Remix Tutorial**](https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/)

`bun.lockb`

> Bun's version of package-lock.json

`remix.env.d.ts`

> Defining both Remix and Cloudflare workers types as global here

`wrangler.toml`

> Cloudflare worker config
