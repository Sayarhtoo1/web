"use client";

import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, LogOut, Home, LayoutDashboard, FileText, FolderOpen, Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    iconName: string;
}

interface AdminMobileNavProps {
    navItems: NavItem[];
    userEmail: string;
}

const iconMap: Record<string, any> = {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Tag
};

export default function AdminMobileNav({ navItems, userEmail }: AdminMobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => pathname.startsWith(href);

    return (
        <>
            {/* Mobile Header Bar */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
                <Link href="/admin/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        O
                    </div>
                    <span className="font-bold text-primary">Admin</span>
                </Link>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Drawer */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="md:hidden fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-card border-l border-border z-50 flex flex-col animate-in slide-in-from-right duration-200">
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = iconMap[item.iconName] || FileText;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "text-foreground/70 hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-border space-y-2">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-foreground/50 hover:text-foreground rounded-lg transition-colors text-sm"
                            >
                                <Home size={18} />
                                View Site
                            </Link>

                            <div className="px-4 py-2 text-xs text-muted-foreground truncate">
                                {userEmail}
                            </div>

                            <form action="/api/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg w-full transition-colors"
                                >
                                    <LogOut size={20} />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
