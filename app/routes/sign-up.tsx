import { json, type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { createServerClient } from "@supabase/auth-helpers-remix";
import type { Database } from "types/supabase";
import Login from "~/components/login";

export default function SignUp() {
  return (
    <div className="min-h-screen w-full flex justify-center align-middle items-center ">
      <div className="max-w-lg">
        <Login isSignUp={true} />
      </div>
    </div>
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const response = new Response();
  let env = context.env as Env;
  const supabase = createServerClient<Database>(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const errors = {} as any;
  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (password.length < 8) {
    errors.password = "Password should be at least 8 characters";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  await supabase.auth.signUp({
    email,
    password,
  });
  // Redirect to dashboard if validation is successful
  return redirect(
    "/email-confirm?email=" + email,

    {
      headers: response.headers,
    }
  );
}
