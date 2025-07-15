import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "SupaStake: SupaDao official staking platform",
		short_name: "SupaStake",
		description:
			"A Progressive Web App for staking SupaCoin Token native to SupaDao",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#8b5cf6",
		icons: [
			{
				src: "/supadao-logo.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/supadao-logo.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
