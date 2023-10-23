import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import {
  SupabaseClient,
  createServerClient,
} from "@supabase/auth-helpers-remix";
import Login from "~/components/login";
import { Button } from "~/components/ui/button";
import Upload from "~/components/upload";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  let env = context.env as Env;

  const response = new Response();
  const supabase = createServerClient(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return json(
    {
      session,
    },
    {
      headers: response.headers,
    }
  );
};

export default function Index() {
  const { session } = useLoaderData<typeof loader>();
  const { supabase } = useOutletContext<{ supabase: SupabaseClient }>();
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
      className="flex text-center justify-center flex-col  min-h-screen w-full"
    >
      <div>
        <h1>Welcome to MMFLDR</h1>
      </div>

      {!session && <Login />}
      {session && (
        <div>
          <Upload />
          <Button className="w-64" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
export async function action({ request, context }: ActionFunctionArgs) {
  console.log("WE IN IT BABY");
  const response = new Response();
  let env = context.env as Env;
  const supabase = createServerClient(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  console.log("EMAIL", email);

  const errors = {} as any;
  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    console.log("Entering errors", errors);
    return json({ errors });
  }
  const res = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("SIGN IN RES", res.data);
  // Redirect to dashboard if validation is successful
  return json(
    {
      status: "success",
    },
    {
      headers: response.headers,
    }
  );
}
