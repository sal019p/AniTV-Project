import Link from "next/link"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function LoginPage() {
  const supabaseConfigured = isSupabaseConfigured()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

        {!supabaseConfigured && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">Demo Mode Active</p>
            <p className="text-sm">Supabase is not configured. Authentication is disabled.</p>
          </div>
        )}

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your email"
              disabled={!supabaseConfigured}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded-md"
              placeholder="Enter your password"
              disabled={!supabaseConfigured}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!supabaseConfigured}
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
