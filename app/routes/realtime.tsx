import { useLoaderData, useOutletContext } from "@remix-run/react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import { useEffect, useState } from "react";

import { json, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import type { SupabaseClient } from "@supabase/auth-helpers-remix";
import { Database } from "types/supabase";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const response = new Response();
  const env = context.env as Env;
  const supabase = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  const { data } = await supabase.from("posts").select();

  return json({ serverPosts: data ?? [] }, { headers: response.headers });
};

export default function Index() {
  const { serverPosts } = useLoaderData<typeof loader>();
  const [posts, setPosts] = useState(serverPosts);
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient;
  }>();

  useEffect(() => {
    setPosts(serverPosts);
  }, [serverPosts]);

  useEffect(() => {
    const channel = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => setPosts([...posts, payload.new as any])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, posts, setPosts]);

  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
