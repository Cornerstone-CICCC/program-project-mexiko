export default function ResetConfirmation() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

        <div className="flex justify-center mb-4">
          <img
            src="/logoConfirmation.svg"   
            alt="Email Sent Icon"
            className="w-28 h-28 object-contain"
          />
        </div>

        <h1 className="text-gray-900 text-2xl font-bold text-center">
          Check Your Email
        </h1>

        <p className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
        </p>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">Email sent to</p>
          <p className="text-gray-900 font-semibold text-sm">
            your.email@example.com
          </p>
        </div>

        <p className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          Didn't receive the email? Check your spam folder or{" "}
          <a href="#" className="text-purple-600 font-medium underline">
            try again
          </a>.
        </p>

        <div className="mt-6 flex flex-col gap-3">

          <a href="/login"
            className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl text-center hover:bg-purple-700 transition flex items-center justify-center gap-2"
          > Back to Login
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
          <button className="w-full py-3 border border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition">
            Resend Email
          </button>
        </div>
      </div>
    </main>
  );
}
