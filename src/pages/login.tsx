import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { NextPage } from 'next'
import { useAuth } from "@/contexts/AuthContext";

// COMPONENTS
import Alert from "@/components/Reusables/Alert";
import Spinner from "@/components/Reusables/Spinner";

const Login: NextPage = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current) return;

    try {
      setError("");
      setLoading(true);
      await signIn(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to sign in");
    }

    setLoading(false);
  }

  return (
    <div className="container px-4 mx-auto">
      <div className="min-h-screen hero bg-base-200">
        <div className="flex-col justify-center hero-content lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="mb-5 text-5xl font-bold">DriftVault</h1>
            <p className="mb-5 text-xl">
              Your secure cloud storage solution.
            </p>
            <p className="mb-5 font-light text-gray-600">
              Store, access, and share your files securely from anywhere. 
              Built with modern tech for the best experience.
            </p>
            <p className="text-sm text-gray-500">
              Built by Ankit Mohanty using Supabase ⚡ & Next.js 🚀
            </p>
          </div>
          <div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
            <div className="card-body">
              <h2 className="mb-4 text-3xl font-bold text-center">Log In</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    className="input input-bordered"
                    ref={emailRef}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    className="input input-bordered"
                    ref={passwordRef}
                    required
                  />
                  <label className="label">
                    <Link href="/forgot-password" className="label-text-alt link link-hover">
                      Forgot password?
                    </Link>
                  </label>
                </div>

                {error && <Alert message={error} type="error" />}

                <div className="mt-6 form-control">
                  <button
                    className={`space-x-2 btn btn-primary ${loading ? "opacity-50" : ""}`}
                    type="submit"
                    disabled={loading}
                  >
                    <span>Login</span> {loading && <Spinner />}
                  </button>
                </div>
              </form>
              <div className="my-4 text-center label-text-alt">
                Need an account?{" "}
                <Link href="/signup" className="link link-hover link-secondary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 