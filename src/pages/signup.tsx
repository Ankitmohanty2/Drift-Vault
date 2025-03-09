import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import type { NextPage } from 'next';

// CONTEXTS
import { useAuth } from "@/contexts/AuthContext";

// COMPONENTS
import Alert from "@/components/Reusables/Alert";
import Spinner from "@/components/Reusables/Spinner";

const SignUp: NextPage = () => {
	const router = useRouter();
	const { signUp } = useAuth();

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current)
			return;

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do not match");
		}

		try {
			setError("");
			setMessage("");
			setLoading(true);

			const { error, confirmEmail } = await signUp(
				emailRef.current.value,
				passwordRef.current.value
			);

			if (error) throw error;

			if (confirmEmail) {
				setMessage("Please check your email for confirmation link");
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("Signup error:", error);
			setError("Failed to create an account");
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
							Welcome to your secure cloud storage.
						</p>
						<p className="mb-5 font-light text-gray-600">
							Join DriftVault today and experience seamless file management
							with enterprise-grade security.
						</p>
						<p className="text-sm text-gray-500">
							Built by Ankit Mohanty using Supabase ⚡ & Next.js 🚀
						</p>
					</div>
					<div className="flex-shrink-0 w-full max-w-sm shadow-2xl card bg-base-100">
						<div className="card-body">
							<h2 className="mb-4 text-3xl font-bold text-center">Sign Up</h2>
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
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Confirm Password</span>
								</label>
								<input
									type="password"
									placeholder="confirm password"
									className="input input-bordered"
									ref={passwordConfirmRef}
									required
								/>
							</div>

							{error && <Alert message={error} type="error" />}
							{message && <div className="alert alert-info">{message}</div>}

							<div className="mt-6 form-control">
								<button
									className={`space-x-2 btn btn-primary ${loading ? "opacity-50" : ""}`}
									onClick={handleSubmit}
									disabled={loading}
								>
									<span>Sign Up</span> {loading && <Spinner />}
								</button>
							</div>
							<label className="my-4 text-center label-text-alt">
								Already have an account?{" "}
								<Link href="/">
									<a className="link link-hover link-secondary">Log In</a>
								</Link>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
