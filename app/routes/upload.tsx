import {
  unstable_composeUploadHandlers,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.env as Env;
  console.log("bruh", await request.clone().formData());

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name !== "img") {
        return undefined;
      }
      let filename2 = filename ?? "blah";
      for await (const d of data) {
        console.log(d);
        const uploadRes = await env.r2_mmflder_bucket.put(filename2, d);
        console.log("WTF RN", uploadRes);
      }

      // parse everything else into memory
      unstable_createMemoryUploadHandler();
    }
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  console.log("form data res>>> ", {
    formData,
  });

  return new Response(`Put something`);
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const env = context.env as Env;
  const url = new URL(request.url);
  const key = url.pathname.slice(1);

  if (!key) {
    return new Response("Key Not Found", { status: 404 });
  }
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
