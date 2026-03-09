"use client";

import Link from "next/link";
import { FiArrowLeft, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg relative">

        <Link href="/" className="absolute left-4 top-4">
          <FiArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
        </Link>

        <h1 className="text-gray-900 text-2xl font-bold text-center mt-6">
          Create Your Account
        </h1>

        <p className="text-gray-500 mt-2 text-sm text-center">
          Find meaningful connections, intentionally.
        </p>

        <form className="w-full mt-8 flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col items-start w-full">
            <label className="text-gray-700 text-sm mb-1">Name</label>

            <div className="relative w-full">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

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

          <div className="flex flex-col items-start w-full">
            <label className="text-gray-700 text-sm mb-1">Confirm Password</label>

            <div className="relative w-full">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400"
              />

              {/* Toggle Confirm Password */}
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input type="checkbox" className="mt-1" />
            <p className="text-gray-600 text-sm text-left">
              I agree to the <span className="text-purple-600 underline">Terms of Service</span> and{" "}
              <span className="text-purple-600 underline">Privacy Policy</span>.
            </p>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition mt-4">
            Create Account
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-semibold">
            Log In
          </Link>
        </p>

      </div>
    </main>
  );
}
