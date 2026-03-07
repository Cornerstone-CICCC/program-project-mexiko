"use client";

import Link from "next/link";
import { FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg relative">

        <Link href="/" className="absolute left-4 top-4">
          <FiArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
        </Link>

        <h1 className="text-gray-900 text-2xl font-bold text-center mt-6">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-2 text-sm text-center">
          Continue your intentional connection journey.
        </p>

        <form className="w-full mt-8 flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col items-start w-full">
            <label className="text-gray-700 text-sm mb-1">Email</label>

            <div className="relative w-full">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col items-start w-full">
            <label className="text-gray-700 text-sm mb-1">Password</label>

            <div className="relative w-full">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Toggle Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 text-gray-600 text-sm">
              <input type="checkbox" />
              Remember me
            </label>

            <Link href="/forgotPassword" className="text-purple-600 text-sm font-medium">
              Forgot Password?
            </Link>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition mt-4">
            Log In
          </button>
        </form>

        {/* Don’t have an account? */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Don’t have an account?{" "}
          <Link href="/signUp" className="text-purple-600 font-semibold">
            Sign Up
          </Link>
        </p>

      </div>
    </main>
  );
}
