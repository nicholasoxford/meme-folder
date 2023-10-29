import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

export function loader({ request: { url }, context }: LoaderFunctionArgs) {
  const parsedUrl = new URL(url);

  console.log({
    pathname: parsedUrl.pathname,
  });

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pathname: parsedUrl.pathname,
      searchParams: parsedUrl.searchParams,
    }),
  };
}
