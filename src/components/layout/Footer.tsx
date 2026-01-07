import { Mail, Facebook, Github } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border/40 bg-background relative z-10">
            {/* Pattern Overlay - 3% Opacity as requested */}
            <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] text-foreground pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

            {/* Decorative Watermark Star - New Addition */}
            <div className="absolute -bottom-12 -right-12 w-96 h-96 opacity-[0.03] pointer-events-none rotate-12">
                <Image src="/assets/hero/Star.svg" alt="Decoration" fill className="object-contain" />
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center p-1.5">
                                <Image src="/assets/hero/Star.svg" alt="Logo" width={24} height={24} className="w-full h-full object-contain brightness-0 invert" />
                            </div>
                            <span className="font-bold text-lg tracking-tight font-mm">
                                Myanmar Muslim Oasis
                            </span>
                        </div>
                        <p className="text-muted-foreground font-mm leading-relaxed max-w-sm text-sm">
                            A curated sanctuary for seeking authentic Islamic knowledge, leveraging modern technology to serve the Ummah.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-foreground/80 text-sm uppercase tracking-widest">Explore</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/categories" className="text-sm text-muted-foreground hover:text-accent transition-colors font-mm">Categories</Link>
                            </li>
                            <li>
                                <Link href="/downloads" className="text-sm text-muted-foreground hover:text-accent transition-colors font-mm">Downloads</Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors font-mm">About Us</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact/Social Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-foreground/80 text-sm uppercase tracking-widest">Connect</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:contact@oasis.mm" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                                    <Mail size={16} />
                                    <span>Contact Support</span>
                                </a>
                            </li>
                            {/* Placeholders for social */}
                            <li className="flex gap-3">
                                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-all">
                                    <Facebook size={14} />
                                </a>
                                <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent transition-all">
                                    <Github size={14} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mm">
                    <p>© {currentYear} Myanmar Muslim Oasis. All rights reserved.</p>
                    <p className="opacity-70">Designed with Ihsan.</p>
                </div>
            </div>
        </footer>
    );
}
