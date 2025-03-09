import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
	currentUser: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<{ error: AuthError | null; confirmEmail: boolean }>;
	signOut: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updateProfile: (metadata: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check active session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setCurrentUser(session?.user ?? null);
			setLoading(false);
		});

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			setCurrentUser(session?.user ?? null);
			setLoading(false);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	async function signUp(email: string, password: string) {
		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) throw error;

			return {
				error: null,
				confirmEmail: data.user && !data.user.confirmed_at
			};
		} catch (error) {
			console.error("Signup error:", error);
			return {
				error: error as AuthError,
				confirmEmail: false
			};
		}
	}

	async function signIn(email: string, password: string) {
		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) throw error;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	}

	async function signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Logout error:", error);
			throw error;
		}
	}

	async function resetPassword(email: string) {
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email);
			if (error) throw error;
		} catch (error) {
			console.error("Reset password error:", error);
			throw error;
		}
	}

	const updateProfile = async (metadata: { name?: string; avatar_url?: string }) => {
		const { error } = await supabase.auth.updateUser({
			data: metadata
		});

		if (error) throw error;
	};

	const value = {
		currentUser,
		loading,
		signIn,
		signUp,
		signOut,
		resetPassword,
		updateProfile
	};

	if (loading) {
		return null; // or a loading spinner
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
