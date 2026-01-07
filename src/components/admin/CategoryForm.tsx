"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { createCategory } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

// Helper to generate slug from Burmese or English text
function generateSlug(text: string): string {
    // For Burmese, we'll use transliteration or just lowercase/dash conversion
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u1000-\u109F-]/g, '') // Keep alphanumeric, spaces, Burmese, dashes
        .replace(/[\s_]+/g, '-') // Replace spaces with dashes
        .replace(/-+/g, '-') // Remove consecutive dashes
        .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
}

export default function CategoryForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name_mm: "",
        name_en: "",
        slug: "",
        description: "",
    });
    const router = useRouter();

    const handleNameChange = (name_mm: string) => {
        setFormData({
            ...formData,
            name_mm,
            // Auto-generate slug if slug is empty or was auto-generated before
            slug: formData.slug === "" || formData.slug === generateSlug(formData.name_mm)
                ? generateSlug(name_mm)
                : formData.slug,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createCategory({
            name_mm: formData.name_mm,
            name_en: formData.name_en || undefined,
            slug: formData.slug || generateSlug(formData.name_mm),
            description: formData.description || undefined,
        });

        if (result.success) {
            setFormData({ name_mm: "", name_en: "", slug: "", description: "" });
            router.refresh();
        } else {
            alert("Error: " + result.error);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Name (Burmese) *</label>
                <input
                    type="text"
                    required
                    value={formData.name_mm}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background font-mm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="ကဏ္ဍအမည်"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Name (English)</label>
                <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Category Name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                    placeholder="category-slug"
                />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background font-mm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                    placeholder="ကဏ္ဍအကြောင်း (optional)"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !formData.name_mm}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Create Category
            </button>
        </form>
    );
}
