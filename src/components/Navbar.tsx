import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import { useTheme } from 'next-themes';

const Navbar: React.FC = () => {
	const router = useRouter();
	const { currentUser, signOut } = useAuth();
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Wait for component to mount to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const handleLogout = async () => {
		try {
			await signOut();
			router.push("/");
		} catch (err) {
			console.log("Failed to log out", err);
		}
	};

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<>
			<div className="sticky top-0 z-50 bg-base-100 border-b backdrop-blur-lg bg-opacity-80">
				<div className="container mx-auto max-w-7xl px-4">
					<div className="navbar min-h-[4.5rem]">
						{/* Logo Section */}
						<div className="flex-1">
							<Link href={currentUser ? "/dashboard" : "/"}>
								<a className="flex items-center gap-3 hover:opacity-80 transition-all">
									<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
										<svg
											className="w-6 h-6 text-primary"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
											/>
										</svg>
									</div>
									<div>
										<span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
											DriftVault
										</span>
										<p className="text-xs text-gray-500 -mt-1">Secure Cloud Storage</p>
									</div>
								</a>
							</Link>
						</div>

						{/* User Section */}
						{currentUser && (
							<div className="flex items-center gap-6">
								{/* Navigation */}
								<nav className="hidden md:flex items-center gap-6">
									<Link href="/dashboard">
										<a className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
											<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
													d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
											</svg>
											My Files
										</a>
									</Link>
								</nav>

								{/* Theme Toggle */}
								{mounted && (
									<button
										onClick={toggleTheme}
										className="p-2 rounded-lg hover:bg-base-200 transition-colors"
										aria-label="Toggle theme"
									>
										{theme === 'dark' ? (
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
													d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
												/>
											</svg>
										) : (
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
													d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
												/>
											</svg>
										)}
									</button>
								)}

								{/* User Dropdown */}
								<div className="dropdown dropdown-end">
									<div 
										className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-base-200 cursor-pointer transition-all" 
										tabIndex={0}
									>
										<div className="avatar">
											<div className="w-8 h-8 rounded-full ring-2 ring-primary/20">
												<img 
													src={currentUser.user_metadata?.avatar_url || 
														`https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.email}`} 
													alt="avatar"
												/>
											</div>
										</div>
										<div className="hidden md:block text-sm">
											<p className="font-medium line-clamp-1">
												{currentUser.user_metadata?.name || currentUser.email}
											</p>
											<p className="text-xs text-gray-500 -mt-0.5">
												{currentUser.email}
											</p>
										</div>
										<svg 
											className="w-4 h-4 opacity-50" 
											fill="none" 
											viewBox="0 0 24 24" 
											stroke="currentColor"
										>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</div>

									<ul className="mt-3 p-2 shadow-lg menu dropdown-content bg-base-100 rounded-box w-60 border">
										<li>
											<button 
												onClick={() => setIsProfileModalOpen(true)}
												className="flex items-center gap-3 px-4 py-3 hover:bg-base-200"
											>
												<div className="avatar">
													<div className="w-10 h-10 rounded-full ring-2 ring-primary/20">
														<img 
															src={currentUser.user_metadata?.avatar_url || 
																`https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.email}`} 
															alt="avatar"
														/>
													</div>
												</div>
												<div>
													<p className="font-medium line-clamp-1">
														{currentUser.user_metadata?.name || 'Set display name'}
													</p>
													<p className="text-xs text-gray-500">
														Edit profile
													</p>
												</div>
											</button>
										</li>
										<div className="divider my-1"></div>
										<li className="md:hidden">
											<Link href="/dashboard">
												<a className="flex items-center gap-2 hover:text-primary">
													<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
															d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
													</svg>
													My Files
												</a>
											</Link>
										</li>
										<li className="md:hidden">
											<Link href="/shared">
												<a className="flex items-center gap-2 hover:text-primary">
													<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
															d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
													</svg>
													Shared
												</a>
											</Link>
										</li>
										<div className="divider my-1"></div>
										<li>
											<button 
												onClick={handleLogout}
												className="flex items-center gap-2 text-error hover:bg-error/10 hover:text-error"
											>
												<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
														d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
												</svg>
												Sign Out
											</button>
										</li>
									</ul>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			
			<ProfileModal 
				isOpen={isProfileModalOpen} 
				onClose={() => setIsProfileModalOpen(false)} 
			/>
		</>
	);
};

export default Navbar;
