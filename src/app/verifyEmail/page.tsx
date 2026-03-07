export default function VerifyEmail() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-lg">

        <div className="flex justify-center mb-4">
          <img
            src="/verifyEmail.svg"  
            alt="Verify Email Icon"
            className="w-28 h-28 object-contain"
          />
        </div>

        <h1 className="text-gray-900 text-2xl font-bold text-center">
          Verify Your Email
        </h1>

        <p className="text-gray-500 mt-2 text-sm text-center leading-relaxed">
          We've sent a verification link to your email address. Please verify your email to continue.
        </p>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">Verification sent to</p>
          <p className="text-gray-900 font-semibold text-sm">
            your.email@example.com
          </p>
        </div>

        <ul className="mt-6 text-gray-700 text-sm space-y-2">
          <li>1. Check your email inbox</li>
          <li>2. Click the verification link</li>
          <li>3. Return here to continue</li>
        </ul>

        <p className="text-gray-500 text-xs mt-4 text-center leading-relaxed">
          Can't find the email? Check your spam folder or{" "}
          <a href="#" className="text-purple-600 font-medium underline">
            resend it
          </a>.
        </p>

        <div className="mt-6 flex flex-col gap-3">

          <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-md hover:bg-purple-700 transition">
            I've Verified My Email
          </button>
          <button className="w-full py-3 border border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition">
            Resend Verification Email
          </button>
        </div>
        <div className="mt-6 text-center">
          <a href="/login" className="text-purple-600 font-medium text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </main>
  );
}
