import {
  unstable_composeUploadHandlers,
  type ActionFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

// POST /upload
export async function action({ request, context }: ActionFunctionArgs) {
  // grab server side env variables from context
  const env = context.env as Env;

  // create a new filename
  // TODO: If they pass in a filename, use that instead
  let NEW_FILENAME = "";
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ contentType, data, filename }) => {
      // if no filename, return undefined
      // This returns to a formdata with the same key of form field
      if (!filename) {
        return undefined;
      }
      // grab file extension
      const ext = filename.split(".").pop();
      if (!ext) {
        return undefined;
      }

      // generate a new filename
      NEW_FILENAME =
        uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }) +
        "." +
        ext; // big_red_donkey.png

      const dataArray1 = [];
      for await (const x of data) {
        dataArray1.push(x);
      }

      await env.r2_mmflder_bucket.put(
        filename,
        new File(dataArray1, filename, {
          type: contentType,
        })
      );

      return env.R2_PUBLIC_URL + NEW_FILENAME;
    },
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );

  // submit file upload
  await unstable_parseMultipartFormData(request, uploadHandler);

  // create a public url from key
  const publicUrl = env.R2_PUBLIC_URL + NEW_FILENAME;

  return new Response(`Put something: ${publicUrl}`);
}
