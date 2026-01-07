"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchDialog from "@/components/features/SearchDialog";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/routing";

export default function Header() {
    const t = useTranslations("Nav");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Global keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const navItems = [
        { label: t("home"), href: "/" },
        { label: t("categories"), href: "/categories" },
        { label: t("downloads"), href: "/downloads" },
        { label: t("about"), href: "/about" },
    ];

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out font-mm",
                    scrolled
                        ? "bg-background/95 backdrop-blur-xl border-b border-border/40 py-2 shadow-sm"
                        : "bg-background border-b border-border/10 py-4"
                )}
            >
                {/* Subtle Pattern Background - Only in Header/Footer as requested */}
                <div className="absolute inset-0 bg-islamic-pattern opacity-[0.03] text-foreground pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

                <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
                    {/* Brand Identity */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-56 h-16 md:w-80 md:h-24">
                            <Image
                                src="/assets/hero/LOGO.svg?v=2"
                                alt="Myanmar Muslim Oasis"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 relative",
                                    isActive(item.href)
                                        ? "text-primary bg-primary/5 font-bold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="ml-2 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                            title="Search (⌘K)"
                        >
                            <Search size={18} />
                        </button>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        <div className="ml-2 pl-4 border-l border-border h-6 flex items-center">
                            <LanguageSwitcher />
                        </div>
                    </nav>

                    {/* Mobile Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                        >
                            <Search size={20} />
                        </button>
                        <ThemeToggle />
                        <button
                            className="p-2 text-foreground/80 hover:text-primary transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-t border-border shadow-2xl animate-accordion-down overflow-hidden">
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-base font-medium p-3 rounded-lg transition-colors flex items-center justify-between",
                                        isActive(item.href)
                                            ? "bg-primary/5 text-primary"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                    {isActive(item.href) && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                                </Link>
                            ))}
                            <div className="h-px bg-border/50 my-2" />
                            <div className="flex justify-between items-center px-3 py-2">
                                <span className="text-sm font-medium text-muted-foreground">App Language</span>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Search Dialog */}
            <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
