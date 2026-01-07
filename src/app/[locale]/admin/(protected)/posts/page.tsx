export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import DeletePostButton from "@/components/admin/DeletePostButton";
import PublishButton from "@/components/admin/PublishButton";

import PaginationControls from "@/components/admin/PaginationControls";

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const supabase = await createClient();
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const perPage = 10;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Get total count first
    const { count } = await supabase.from("posts").select("*", { count: "exact", head: true });

    // Get paginated data
    const { data: posts } = await supabase
        .from("posts")
        .select("*, post_categories(category_id, categories(name_mm))")
        .order("created_at", { ascending: false })
        .range(from, to);

    const totalPages = Math.ceil((count || 0) / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-mm">Manage Posts</h1>
                <Link
                    href="/admin/posts/new"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
                >
                    <Plus size={20} />
                    New Post
                </Link>
            </div>

            {/* Posts Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Title</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {posts?.map((post) => (
                                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium font-mm block">{post.title_mm}</span>
                                        {post.title_en && (
                                            <span className="text-xs text-muted-foreground font-sans">{post.title_en}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.post_categories?.[0]?.categories?.name_mm ? (
                                            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded text-xs font-mm">
                                                {post.post_categories[0].categories.name_mm}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${post.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                            : post.status === 'draft'
                                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/70">
                                        {post.published_at
                                            ? format(new Date(post.published_at), 'MMM d, yyyy')
                                            : format(new Date(post.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <PublishButton
                                                postId={post.id}
                                                currentStatus={post.status}
                                            />
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                target="_blank"
                                                className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <DeletePostButton postId={post.id} postTitle={post.title_mm} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!posts || posts.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-4">
                                            <Search className="w-12 h-12 text-muted-foreground/30" />
                                            <p>No posts found. Create one to get started.</p>
                                            <Link
                                                href="/admin/posts/new"
                                                className="text-primary hover:underline font-medium"
                                            >
                                                Create your first post →
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-border">
                    {posts?.map((post) => (
                        <div key={post.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium font-mm truncate">{post.title_mm}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {post.published_at
                                            ? format(new Date(post.published_at), 'MMM d, yyyy')
                                            : format(new Date(post.created_at), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${post.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {post.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <PublishButton postId={post.id} currentStatus={post.status} />
                                <Link
                                    href={`/posts/${post.slug}`}
                                    target="_blank"
                                    className="p-2 text-foreground/50 hover:text-primary transition-colors"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="p-2 text-foreground/50 hover:text-primary transition-colors"
                                >
                                    <Edit size={18} />
                                </Link>
                                <DeletePostButton postId={post.id} postTitle={post.title_mm} />
                            </div>
                        </div>
                    ))}
                    {(!posts || posts.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">
                            No posts found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>


            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
            />
        </div >
    );
}
