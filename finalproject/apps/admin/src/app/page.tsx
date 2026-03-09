import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center text-center px-6 max-w-sm w-full">

      <div className="flex flex-col items-center gap-2">
        <img src="/logo.svg" alt="MindMatch Logo" className="w-20 h-20" />
        <p className="text-white text-sm opacity-80">Connect Beyond the Surface</p>
      </div>

      <h1 className="text-white text-2xl font-bold mt-10">
        Discover Your Personality Connection
      </h1>

      <p className="text-white/80 mt-3 text-sm">
        Find meaningful relationships based on MBTI compatibility. Because
        understanding each other starts with understanding yourself.
      </p>

      <div className="flex flex-col gap-3 w-full mt-10">

        <Link href="/signUp"
          className="w-full py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition text-center"
        > Get Started</Link>

        <Link href="/login"
          className="w-full py-3 border border-white text-white font-semibold rounded-xl hover:bg-white/10 transition text-center"
        >Log In </Link>
      </div>

      <div className="flex gap-6 mt-12 text-white/70 text-sm">
        <a href="#" className="hover:text-white">Demo: MBTI Test</a>
        <a href="#" className="hover:text-white">Tech Stack</a>
        <a href="#" className="hover:text-white">Admin</a>
      </div>

    </main>
  );
}
