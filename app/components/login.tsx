import { Form, Link } from "@remix-run/react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function Login({ isSignUp }: { isSignUp?: boolean }) {
  return (
    <>
      <Card className="border-2 border-dashed border-gray-500 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 max-w-lg mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Sign Up For" : "Login To "} MMFLDR
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form method="post">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="test@example.com"
                required
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            <Button
              className="w-full bg-green-500 text-white py-2 rounded-lg mt-4"
              variant="default"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </Form>
        </CardContent>
        {!isSignUp && (
          <CardFooter className="mt-2 text-center text-sm">
            Don't have an account?
            <Link className="underline ml-1 text-green-500" to="/sign-up">
              Sign up
            </Link>
          </CardFooter>
        )}
        {isSignUp && (
          <CardFooter className="mt-2 text-center text-sm ml-1">
            Already have an account?{" "}
            <Link className="underline text-green-500" to="/">
              Log in
            </Link>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
