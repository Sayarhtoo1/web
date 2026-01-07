export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { Plus, Search, Tag } from "lucide-react";
import TagForm from "@/components/admin/TagForm";
import TagItem from "@/components/admin/TagItem";

export default async function AdminTagsPage() {
    const supabase = await createClient();

    const { data: tags } = await supabase
        .from("tags")
        .select("*, post_tags(count)")
        .order("name_mm");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-mm">Tags</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create New Tag Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            New Tag
                        </h2>
                        <TagForm />
                    </div>
                </div>

                {/* Tags Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <h2 className="font-bold">All Tags ({tags?.length || 0})</h2>
                        </div>

                        {tags && tags.length > 0 ? (
                            <div className="p-4 flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <TagItem
                                        key={tag.id}
                                        tag={tag}
                                        postCount={tag.post_tags?.[0]?.count || 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-4">
                                    <Tag className="w-12 h-12 text-muted-foreground/30" />
                                    <p>No tags yet. Create one to get started.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
