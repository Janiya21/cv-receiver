// src/app/auth/signin/page.tsx
"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Image } from "@nextui-org/image";

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const result = await signIn("google", { redirect: false });
    if (result?.error) {
      setError("Failed to sign in with Google");
      console.error("Failed to sign in with Google:", result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-3 flex flex-col justify-center sm:py-12">
      <div className="relative  sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4  bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <Image
                className="mt-5"
                width={250}
                alt="NextUI hero Image"
                src="https://www.senfin.com/images/header/logo-xs@2x.png"
              />
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <form
                  onSubmit={async (e: any) => {
                    e.preventDefault();
                    setError(null);
                    const username = e.target.username.value;
                    const password = e.target.password.value;
                    const result = await signIn("credentials", {
                      redirect: false,
                      username,
                      password,
                    });

                    if (result?.error) {
                      setError("Invalid username or password");
                      console.error("Failed to sign in:", result.error);
                    } else {
                      window.location.href = "/";
                    }
                  }}
                >
                  <div className="relative my-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Username"
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Username
                    </label>
                  </div>
                  <div className="relative mt-4 mb-10">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      placeholder="Password"
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <button
                      type="submit"
                       className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-300 mt-4"
                    >
                      Log In
                    </button>
                  </div>
                </form>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white text-green-600 border-2 border-green-300 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-white mt-4"
                >
                  Sign In with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
