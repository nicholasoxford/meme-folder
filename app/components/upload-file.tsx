/**
 * v0 by Vercel.
 * @see https://v0.dev/t/0pQC0AZkkMz
 */

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useFetcher } from "@remix-run/react";
import { Button } from "./ui/button";

export default function Upload() {
  const fetcher = useFetcher();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer>("");
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result ?? "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result ?? "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    // @ts-ignore
    formData.append("picture", imageSrc);

    // Create a fetch request to send the form data
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle a successful response, e.g., redirect or show a success message
        console.log("Form submitted successfully.");
        // Add your desired logic here, such as navigation or displaying a success message.
      } else {
        // Handle an unsuccessful response, e.g., show an error message
        console.error("Form submission failed.");
        // Add your desired error handling logic here.
      }
    } catch (error) {
      // Handle any network errors, e.g., connection issues
      console.error("Network error:", error);
      // Add your desired error handling logic here.
    }
  };

  return (
    <fetcher.Form action="/upload" method="post" onSubmit={handleFormSubmit}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-100/40 dark:bg-zinc-800/40"
      >
        <div className="w-10/12 md-w-8/12 lg:w-6/12 max-w-2xl p-10 border-4 border-dashed border-zinc-600 dark:border-zinc-400 rounded-lg">
          <div className="flex flex-col items-center gap-6">
            <svg
              className=" h-24 w-24 text-zinc-600 dark:text-zinc-400"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400">
              Drag & Drop your image here
            </div>
            <div className="text-zinc-500 dark:text-zinc-400">or</div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input
                onChange={handleInputChange}
                id="picture"
                type="file"
                name="picture"
              />
            </div>
            <input
              className="hidden "
              id="pictureDrop"
              type="file"
              name="pictureDrop"
            />
            {imageSrc && (
              <div className="mt-10">
                <img
                  alt="Uploaded img"
                  className="aspect-square object-cover w-full rounded-lg overflow-hidden "
                  height={200}
                  src={imageSrc as string}
                  width={200}
                />
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-2/3 mt-10 bg-green-500 text-white py-2 rounded-lg"
          >
            {" "}
            Submit
          </Button>
        </div>
      </div>
    </fetcher.Form>
  );
}