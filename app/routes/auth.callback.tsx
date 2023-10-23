import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/server-runtime";
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "types/supabase";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  let env = context.env as Env;

  const response = new Response();
  const supabaseClient = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data } = await supabaseClient.from("test").select("*");

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};
export const action = async ({ request, context }: ActionFunctionArgs) => {
  const response = new Response();
  let env = context.env as Env;
  const supabaseClient = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const { data } = await supabaseClient.from("test").select("*");

  return json(
    { data },
    {
      headers: response.headers,
    }
  );
};
