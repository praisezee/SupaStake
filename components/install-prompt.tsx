"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

export function InstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setIsDialogOpen(true);
		};

		window.addEventListener("beforeinstallprompt", handler);

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
		};
	}, []);

	const handleInstallClick = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === "accepted") {
				console.log("User accepted the install prompt");
			} else {
				console.log("User dismissed the install prompt");
			}
			setDeferredPrompt(null);
			setIsDialogOpen(false);
		}
	};

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px] glass-effect border-purple-500/30">
				<DialogHeader>
					<DialogTitle className="text-gradient-purple-lime">
						Install SupaStake
					</DialogTitle>
					<DialogDescription className="text-muted-foreground">
						Add SupaStake to your home screen for quick and easy access.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<Button
						onClick={handleInstallClick}
						className="gradient-purple-lime text-black font-semibold text-lg px-8 py-4 glow-purple">
						<Sparkles className="w-5 h-5 mr-2" />
						Install App
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
