# Welcome to MMFLDR (MEME FOLDER)!

- The easiest way to upload and track your memes.

## Tech Stack

- [`Bun`](https://bun.sh/docs)
- [Remix](https://remix.run/docs)
- CDN: [Cloudflare R2](https://developers.cloudflare.com/r2/)
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
