"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deletePost } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

interface DeletePostButtonProps {
    postId: string;
    postTitle: string;
}

export default function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const result = await deletePost(postId);

        if (result.success) {
            router.refresh();
        } else {
            alert("Error deleting post: " + result.error);
        }

        setLoading(false);
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-lg"
                title="Delete"
                disabled={loading}
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Post?</h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete <strong className="font-mm">&quot;{postTitle}&quot;</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
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
