import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.env as Env;
  const url = new URL(request.url);
  const key = url.pathname.slice(1);

  if (!key) {
    return new Response("Key Not Found", { status: 404 });
  }

  await env.r2_mmflder_bucket.put(key, request.body);
  return new Response(`Put ${key} successfully!`);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.env as Env;
  const url = new URL(request.url);
  const key = url.pathname.slice(1);

  if (!key) {
    return new Response("Key Not Found", { status: 404 });
  }
  console.log("key", key);
  const object = await env.r2_mmflder_bucket.get(key);

  if (object === null) {
    return new Response("Object Not Found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, {
    headers,
  });
}
