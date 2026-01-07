"use client";

import { useState } from "react";
import { Trash2, Edit2, Check, X, Loader2, FolderOpen } from "lucide-react";
import { deleteCategory, updateCategory } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

interface Category {
    id: string;
    name_mm: string;
    name_en: string | null;
    slug: string;
    description: string | null;
}

interface CategoryItemProps {
    category: Category;
    postCount: number;
}

export default function CategoryItem({ category, postCount }: CategoryItemProps) {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name_mm: category.name_mm,
        name_en: category.name_en || "",
        slug: category.slug,
        description: category.description || "",
    });
    const router = useRouter();

    const handleUpdate = async () => {
        setLoading(true);
        const result = await updateCategory(category.id, {
            name_mm: formData.name_mm,
            name_en: formData.name_en || undefined,
            slug: formData.slug,
            description: formData.description || undefined,
        });

        if (result.success) {
            setEditing(false);
            router.refresh();
        } else {
            alert("Error: " + result.error);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteCategory(category.id);

        if (result.success) {
            router.refresh();
        } else {
            alert("Error: " + result.error);
        }
        setLoading(false);
        setShowDeleteConfirm(false);
    };

    if (editing) {
        return (
            <div className="p-4 bg-muted/30 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        value={formData.name_mm}
                        onChange={(e) => setFormData({ ...formData, name_mm: e.target.value })}
                        className="p-2 rounded border border-border bg-background font-mm text-sm"
                        placeholder="Name (Burmese)"
                    />
                    <input
                        type="text"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        className="p-2 rounded border border-border bg-background text-sm"
                        placeholder="Name (English)"
                    />
                </div>
                <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2 rounded border border-border bg-background font-mono text-sm"
                    placeholder="Slug"
                />
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 rounded border border-border bg-background font-mm text-sm resize-none"
                    placeholder="Description"
                    rows={2}
                />
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setEditing(false)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={loading}
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={handleUpdate}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg transition-colors"
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 flex items-center gap-4 hover:bg-muted/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FolderOpen size={20} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-medium font-mm truncate">{category.name_mm}</h3>
                    {category.name_en && (
                        <p className="text-sm text-muted-foreground truncate">{category.name_en}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                        /{category.slug} • {postCount} posts
                    </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => setEditing(true)}
                        className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        title="Delete"
                        disabled={loading}
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl border border-border p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Category?</h3>
                        <p className="text-muted-foreground mb-4">
                            Are you sure you want to delete <strong className="font-mm">&quot;{category.name_mm}&quot;</strong>?
                            {postCount > 0 && (
                                <span className="block text-amber-600 mt-2">
                                    ⚠️ This category has {postCount} posts. They will become uncategorized.
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
