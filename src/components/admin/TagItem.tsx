"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { deleteTag } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

interface Tag {
    id: string;
    name_mm: string;
    name_en: string | null;
    slug: string;
}

interface TagItemProps {
    tag: Tag;
    postCount: number;
}

export default function TagItem({ tag, postCount }: TagItemProps) {
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteTag(tag.id);

        if (result.success) {
            router.refresh();
        } else {
            alert("Error: " + result.error);
        }
        setLoading(false);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="group relative inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                <span className="font-mm text-sm">{tag.name_mm}</span>
                {postCount > 0 && (
                    <span className="text-xs text-primary/60">({postCount})</span>
                )}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-full text-red-500 transition-all"
                    title="Delete tag"
                    disabled={loading}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Tag?</h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete <strong className="font-mm">&quot;{tag.name_mm}&quot;</strong>?
                            {postCount > 0 && (
                                <span className="block text-amber-600 mt-2">
                                    ⚠️ This tag is used by {postCount} posts.
                                </span>
                            )}
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                disabled={loading}
                            >
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
