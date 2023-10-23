import {
  unstable_composeUploadHandlers,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
export async function action({ request, context }: ActionFunctionArgs) {
  const env = context.env as Env;
  let NEW_FILENAME = "";
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      // grab file extension
      if (!filename) {
        return undefined;
      }
      const ext = filename.split(".").pop();
      if (!ext) {
        return undefined;
      }
      NEW_FILENAME = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
      }); // big_red_donkey

      NEW_FILENAME = NEW_FILENAME + "." + ext;
      const dataArray1 = [];
      for await (const x of data) {
        dataArray1.push(x);
      }
      await env.r2_mmflder_bucket
        .put(
          filename,
          new File(dataArray1, filename, {
            type: contentType,
          })
        )
        .catch((err) => {
          console.log("MY DAWG THE CATCH", err);
        });
      return env.R2_PUBLIC_URL + NEW_FILENAME;
      // parse everything else into memory
    },
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  for (const pair of formData.entries()) {
    console.log(`LOOK HERE: ${pair[0]}, ${pair[1]}`);
  }

  const publicUrl = env.R2_PUBLIC_URL + NEW_FILENAME;

  return new Response(`Put something: ${publicUrl}`);
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
