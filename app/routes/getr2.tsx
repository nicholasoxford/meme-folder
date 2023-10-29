import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.env as Env;

  const bucket = env.R2;

  const items = await bucket.list();

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  };
}
