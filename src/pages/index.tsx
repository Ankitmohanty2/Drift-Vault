import type { NextPage } from 'next';
import FilesAndFoldersDisplay from '@/components/FilesAndFoldersDisplay';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

const Home: NextPage = () => {
	const { currentUser } = useAuth();

	if (currentUser) {
		return <FilesAndFoldersDisplay folderId={null} />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				{/* Decorative blobs */}
				<div className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
				
				<div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
					<div className="max-w-5xl mx-auto text-center">
						<div className="inline-block mb-8 p-2 bg-base-100 rounded-2xl shadow-lg">
							<div className="px-4 py-2 bg-primary/10 rounded-xl">
								<span className="text-primary font-medium">
									🚀 Secure Cloud Storage for Everyone
								</span>
							</div>
						</div>
						
						<h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
							Store Your Files with{' '}
							<span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
								Confidence
							</span>
						</h1>
						
						<p className="text-xl md:text-2xl text-base-content/60 mb-12 max-w-3xl mx-auto leading-relaxed">
							Experience enterprise-grade security with intuitive file management. 
							Your data, your control, anywhere in the world.
						</p>
						
						<div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
							<Link href="/signup">
								<a className="btn btn-primary btn-lg px-8 h-16 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
									Start for Free
									<svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</a>
							</Link>
							<Link href="/login">
								<a className="btn btn-ghost btn-lg px-8 h-16 text-lg hover:bg-base-200">
									Sign In
									<svg className="w-6 h-6 ml-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
									</svg>
								</a>
							</Link>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
							{[
								{ label: 'Active Users', value: '10K+' },
								{ label: 'Files Stored', value: '1M+' },
								{ label: 'Data Secured', value: '99.9%' },
								{ label: 'Countries', value: '150+' },
							].map((stat, index) => (
								<div key={index} className="text-center">
									<div className="text-3xl md:text-4xl font-bold text-primary mb-2">
										{stat.value}
									</div>
									<div className="text-base-content/60">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="bg-base-100 py-24">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{[
							{
								icon: (
									<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								),
								title: "Bank-Grade Security",
								description: "Your files are encrypted end-to-end with military-grade encryption protocols.",
								color: "primary"
							},
							{
								icon: (
									<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
											d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
									</svg>
								),
								title: "Smart Organization",
								description: "Intelligent file organization with powerful search and filtering capabilities.",
								color: "secondary"
							},
							{
								icon: (
									<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								),
								title: "Real-time Sync",
								description: "Access your latest files instantly across all your devices.",
								color: "accent"
							}
						].map((feature, index) => (
							<div key={index} 
								className="relative group p-8 rounded-2xl bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
							>
								<div className={`w-16 h-16 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-6 text-${feature.color} group-hover:scale-110 transition-transform`}>
									{feature.icon}
								</div>
								<h2 className="text-2xl font-bold mb-4">{feature.title}</h2>
								<p className="text-base-content/60 leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
