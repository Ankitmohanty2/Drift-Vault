/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
	reactStrictMode: true,
	images: {
		domains: [
			"firebasestorage.googleapis.com",
			"jdhdzqhxdwmsbsqdifsj.supabase.co",
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [{
				loader: '@svgr/webpack',
				options: {
					svgoConfig: {
						plugins: [
							{
								name: 'removeViewBox',
								active: false
							}
						]
					}
				}
			}]
		});
		return config;
	}
};

module.exports = nextConfig;
