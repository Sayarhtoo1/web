import { createClient } from "@/lib/supabase/server";
import { FileText, CheckCircle, FolderOpen, Download, Clock, Eye } from "lucide-react";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch all statistics in parallel
    const [
        { count: totalPosts },
        { count: publishedPosts },
        { count: draftPosts },
        { count: totalCategories },
        { count: totalAttachments },
        { data: recentPosts },
        { data: viewsData },
    ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('attachments').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('id, title_mm, status, created_at, published_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('posts').select('view_count'),
    ]);

    // Calculate total views
    const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

    const stats = [
        { label: "Total Posts", value: totalPosts || 0, icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
        { label: "Published", value: publishedPosts || 0, icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-950/20" },
        { label: "Drafts", value: draftPosts || 0, icon: Clock, color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/20" },
        { label: "Categories", value: totalCategories || 0, icon: FolderOpen, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
        { label: "Downloads", value: totalAttachments || 0, icon: Download, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/20" },
        { label: "Total Views", value: totalViews, icon: Eye, color: "text-rose-600", bgColor: "bg-rose-50 dark:bg-rose-950/20" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-mm">Dashboard</h1>
                <Link
                    href="/admin/posts/new"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    + New Post
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
                    >
                        <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                    href="/admin/posts/new"
                    className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl hover:border-primary/40 transition-colors group"
                >
                    <FileText className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-foreground">Create New Post</h3>
                    <p className="text-sm text-muted-foreground mt-1">Write and publish new content</p>
                </Link>

                <Link
                    href="/admin/categories"
                    className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl hover:border-blue-500/40 transition-colors group"
                >
                    <FolderOpen className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-foreground">Manage Categories</h3>
                    <p className="text-sm text-muted-foreground mt-1">Organize your content</p>
                </Link>

                <Link
                    href="/"
                    target="_blank"
                    className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl hover:border-emerald-500/40 transition-colors group"
                >
                    <Eye className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-foreground">View Site</h3>
                    <p className="text-sm text-muted-foreground mt-1">Preview your public website</p>
                </Link>
            </div>

            {/* Recent Posts */}
            <div className="bg-card rounded-xl border border-border">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent Posts</h2>
                    <Link href="/admin/posts" className="text-sm text-primary hover:underline">
                        View all →
                    </Link>
                </div>
                <div className="divide-y divide-border">
                    {recentPosts?.map((post) => (
                        <Link
                            key={post.id}
                            href={`/admin/posts/${post.id}/edit`}
                            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate font-mm">{post.title_mm}</p>
                                <p className="text-sm text-muted-foreground">
                                    {post.published_at
                                        ? format(new Date(post.published_at), 'MMM d, yyyy')
                                        : format(new Date(post.created_at), 'MMM d, yyyy')}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ml-4 ${post.status === 'published'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }`}>
                                {post.status}
                            </span>
                        </Link>
                    ))}
                    {(!recentPosts || recentPosts.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">
                            No posts yet. Create your first post!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
