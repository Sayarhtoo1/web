export const runtime = 'edge';
import PostForm from "@/components/admin/PostForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('posts')
        .select('*, attachments(*), post_categories(category_id)')
        .eq('id', id)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/posts"
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Edit Post</h1>
                    <p className="text-sm text-muted-foreground font-mm truncate max-w-md">
                        {post.title_mm}
                    </p>
                </div>
            </div>
            <PostForm initialData={post} />
        </div>
    );
}
