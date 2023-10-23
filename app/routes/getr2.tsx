import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.env as Env;

  const bucket = env.r2_mmflder_bucket;

  const items = await bucket.list();

  for (const t of items.objects) {
    console.log(t.key);
  }

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  };
}
