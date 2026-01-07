"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { createTag } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u1000-\u109F-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function TagForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name_mm: "",
        name_en: "",
        slug: "",
    });
    const router = useRouter();

    const handleNameChange = (name_mm: string) => {
        setFormData({
            ...formData,
            name_mm,
            slug: formData.slug === "" || formData.slug === generateSlug(formData.name_mm)
                ? generateSlug(name_mm)
                : formData.slug,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createTag({
            name_mm: formData.name_mm,
            name_en: formData.name_en || undefined,
            slug: formData.slug || generateSlug(formData.name_mm),
        });

        if (result.success) {
            setFormData({ name_mm: "", name_en: "", slug: "" });
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
                    placeholder="တဂ်အမည်"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Name (English)</label>
                <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Tag Name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                    placeholder="tag-slug"
                />
            </div>

            <button
                type="submit"
                disabled={loading || !formData.name_mm}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Create Tag
            </button>
        </form>
    );
}
