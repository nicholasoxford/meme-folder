import {
  unstable_composeUploadHandlers,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";

export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.env as Env;

  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (!filename) {
        return undefined;
      }
      console.log("Are we even?", {
        name,
        filename,
        contentType,
      });
      const dataArray1 = [];

      for await (const x of data) {
        dataArray1.push(x);
      }
      const uploadRes = await env.r2_mmflder_bucket.put(
        filename,
        new File(dataArray1, filename, {
          type: contentType,
        })
      );
      console.log("upload res>>> ", { uploadResIThink: uploadRes?.uploaded });

      // parse everything else into memory
      unstable_createMemoryUploadHandler();
    }
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  console.log("form data res>>> ");
  for (let [key, value] of formData.entries()) {
    console.log("another key");
    console.log(key, value);
  }

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
