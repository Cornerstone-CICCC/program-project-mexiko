export default function ForgotPassword() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

        <h1 className="text-gray-900 text-2xl font-bold text-center">
          Forgot Password?
        </h1>

        <p className="text-gray-500 mt-2 text-sm text-center">
          No worries! Enter your email and we'll send you a link to reset your password.
        </p>

        <div className="flex justify-center mt-6 mb-2">
          <img src="/email.svg"  
          alt="Reset Password Icon" className="w-32 h-32 object-contain" />
        </div>

        <form className="w-full mt-8 flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col items-start w-full">
            <label className="text-gray-700 text-sm mb-1">Email Address</label>

            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 9.4 12 12.75 7.5 9.4m12 8.1H4.5A1.5 1.5 0 0 1 3 16V8a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 8v8a1.5 1.5 0 0 1-1.5 1.5Z"
                />
              </svg>

              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition mt-2 flex items-center justify-center gap-2">
            <img src="/arrow.svg" alt="Send Icon" className="w-5 h-5" />
            Send Reset Link
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          If you don't see the email in your inbox, check your spam folder.  
          The link will expire in 1 hour.
        </p>
        <div className="mt-6 text-center">
          <a href="/login" className="text-purple-600 font-medium text-sm">
            &lt; Back to Login
          </a>
        </div>
      </div>
    </main>
  );
}
