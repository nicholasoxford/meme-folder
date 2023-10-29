import {
  unstable_composeUploadHandlers,
  type ActionFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "types/supabase";
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

  const response = new Response();
  const supabase = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user;

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

      await env.R2.put(
        NEW_FILENAME,
        new File(dataArray1, NEW_FILENAME, {
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
  const PUBLIC_URL = env.R2_PUBLIC_URL + NEW_FILENAME;
  const supabaseInsert = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
  await supabaseInsert.from("assets").insert({
    userId: user.id,
    R2_KEY: NEW_FILENAME,
    PUBLIC_URL,
  });

  return new Response(`Put something: ${PUBLIC_URL}`);
}
