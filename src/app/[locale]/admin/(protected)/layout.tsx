import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { LayoutDashboard, FileText, FolderOpen, Tag, LogOut, Menu, X, Home } from "lucide-react";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Posts", href: "/admin/posts", icon: FileText },
    { label: "Categories", href: "/admin/categories", icon: FolderOpen },
    { label: "Tags", href: "/admin/tags", icon: Tag },
];

export default async function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Double-check auth (middleware should handle this, but just in case)
    if (!user) {
        redirect({ href: '/admin/login', locale });
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-screen">
                <div className="p-6 border-b border-border">
                    <Link href="/admin/dashboard" className="text-xl font-bold text-primary font-mm flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            O
                        </div>
                        Oasis Admin
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-foreground/70 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors group"
                        >
                            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border space-y-2">
                    {/* View Site Link */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 text-foreground/50 hover:text-foreground rounded-lg transition-colors text-sm"
                    >
                        <Home size={18} />
                        View Site
                    </Link>

                    {/* User Info */}
                    <div className="px-4 py-2 text-xs text-muted-foreground truncate">
                        {user?.email}
                    </div>

                    {/* Sign Out */}
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
            </aside>

            {/* Mobile Header - Pass only serializable data */}
            <AdminMobileNav
                navItems={navItems.map(item => ({
                    label: item.label,
                    href: item.href,
                    iconName: item.label === 'Dashboard' ? 'LayoutDashboard' :
                        item.label === 'Posts' ? 'FileText' :
                            item.label === 'Categories' ? 'FolderOpen' :
                                'Tag'
                }))}
                userEmail={user?.email || ''}
            />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
