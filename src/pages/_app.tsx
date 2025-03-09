import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ThemeProvider } from 'next-themes';

// COMPONENTS
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrivateRoute from "@/components/PrivateRoute";

// CONTEXTS
import { AuthProvider } from "@/contexts/AuthContext";

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/forgot-password'];

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const isPublicRoute = publicRoutes.includes(router.pathname);

	return (
		<ThemeProvider attribute="data-theme" defaultTheme="system">
			<AuthProvider>
				<Layout>
					{isPublicRoute ? (
						<Component {...pageProps} />
					) : (
						<PrivateRoute>
							<Component {...pageProps} />
						</PrivateRoute>
					)}
				</Layout>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default MyApp;
