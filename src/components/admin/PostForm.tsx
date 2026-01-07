"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { useState, useEffect } from "react";

import { Loader2, Save, Calendar, Image as ImageIcon, Eye } from "lucide-react";
import AttachmentManager from "./AttachmentManager";
import MarkdownToolbar from "./MarkdownToolbar";
import ImageUpload from "./ImageUpload";
import PostPreview from "./PostPreview";

interface Category {
    id: string;
    name_mm: string;
    name_en: string | null;
}

interface PostFormProps {
    initialData?: {
        id?: string;
        title_mm?: string;
        title_en?: string;
        slug?: string;
        content_mm?: string;
        content_en?: string;
        excerpt_mm?: string;
        excerpt_en?: string;
        status?: string;
        featured?: boolean;
        cover_image_url?: string;
        published_at?: string;
        attachments?: any[];
        post_categories?: { category_id: string }[];
    };
}

function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u1000-\u109F-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function PostForm({ initialData }: PostFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData?.post_categories?.map(pc => pc.category_id) || []
    );

    const [formData, setFormData] = useState({
        title_mm: initialData?.title_mm || "",
        title_en: initialData?.title_en || "",
        slug: initialData?.slug || "",
        content_mm: initialData?.content_mm || "",
        content_en: initialData?.content_en || "",
        excerpt_mm: initialData?.excerpt_mm || "",
        excerpt_en: initialData?.excerpt_en || "",
        status: initialData?.status || "draft",
        featured: initialData?.featured || false,
        cover_image_url: initialData?.cover_image_url || "",
        published_at: initialData?.published_at || "",
    });

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from('categories')
                .select('id, name_mm, name_en')
                .order('name_mm');
            if (data) setCategories(data);
        }
        fetchCategories();
    }, [supabase]);

    // Auto-generate slug from title
    const handleTitleChange = (title_mm: string) => {
        setFormData({
            ...formData,
            title_mm,
            slug: formData.slug === "" || formData.slug === generateSlug(formData.title_mm)
                ? generateSlug(title_mm)
                : formData.slug,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let postId = initialData?.id;

            // Prepare post data
            const postData = {
                id: postId,
                ...formData,
                published_at: formData.status === 'published' && !formData.published_at
                    ? new Date().toISOString()
                    : formData.published_at || null,
                updated_at: new Date().toISOString(),
            };

            // Upsert Post
            const { data: post, error: postError } = await supabase
                .from("posts")
                .upsert(postData)
                .select()
                .single();

            if (postError) throw postError;
            postId = post.id;

            // Update categories
            // First, remove all existing category links for this post
            await supabase
                .from("post_categories")
                .delete()
                .eq("post_id", postId);

            // Then add new category links
            if (selectedCategories.length > 0) {
                const categoryLinks = selectedCategories.map(categoryId => ({
                    post_id: postId,
                    category_id: categoryId,
                }));
                await supabase.from("post_categories").insert(categoryLinks);
            }

            router.push("/admin/posts");
            router.refresh();
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-20">
            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Title (Burmese) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title_mm}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full p-3 rounded-lg border border-border bg-background font-mm focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="ပို့စ်ခေါင်းစဉ်"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Title (English)</label>
                    <input
                        type="text"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Post Title"
                    />
                </div>
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Slug (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">/posts/</span>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="flex-1 p-3 rounded-lg border border-border bg-background font-mono text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="post-slug"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Auto-generated from title. Change if needed.</p>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
                <label className="block text-sm font-medium flex items-center gap-2">
                    <ImageIcon size={16} className="text-muted-foreground" />
                    Cover Image
                </label>
                <ImageUpload
                    value={formData.cover_image_url}
                    onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
                />
            </div>

            {/* Excerpts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Excerpt (Burmese)</label>
                    <textarea
                        rows={3}
                        value={formData.excerpt_mm}
                        onChange={(e) => setFormData({ ...formData, excerpt_mm: e.target.value })}
                        className="w-full p-3 rounded-lg border border-border bg-background font-mm resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="အကျဉ်းချုပ် (optional)"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Excerpt (English)</label>
                    <textarea
                        rows={3}
                        value={formData.excerpt_en}
                        onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                        className="w-full p-3 rounded-lg border border-border bg-background resize-none focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Brief summary (optional)"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Content (Burmese - Markdown)
                    </label>
                    <div>
                        <MarkdownToolbar
                            textareaId="content_mm"
                            onInsert={(text) => {
                                const textarea = document.getElementById('content_mm') as HTMLTextAreaElement;
                                if (textarea) {
                                    const start = textarea.selectionStart;
                                    const before = formData.content_mm.substring(0, start);
                                    const after = formData.content_mm.substring(textarea.selectionEnd);
                                    setFormData({ ...formData, content_mm: before + text + after });
                                }
                            }}
                        />
                        <textarea
                            id="content_mm"
                            rows={15}
                            value={formData.content_mm}
                            onChange={(e) => setFormData({ ...formData, content_mm: e.target.value })}
                            className="w-full p-3 rounded-b-lg border border-border border-t-0 bg-background font-mm resize-y focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                            placeholder="အကြောင်းအရာ (Markdown supported)"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Content (English - Markdown)
                    </label>
                    <div>
                        <MarkdownToolbar
                            textareaId="content_en"
                            onInsert={(text) => {
                                const textarea = document.getElementById('content_en') as HTMLTextAreaElement;
                                if (textarea) {
                                    const start = textarea.selectionStart;
                                    const before = formData.content_en.substring(0, start);
                                    const after = formData.content_en.substring(textarea.selectionEnd);
                                    setFormData({ ...formData, content_en: before + text + after });
                                }
                            }}
                        />
                        <textarea
                            id="content_en"
                            rows={15}
                            value={formData.content_en}
                            onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                            className="w-full p-3 rounded-b-lg border border-border border-t-0 bg-background resize-y focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                            placeholder="Content (Markdown supported)"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <label className="block text-sm font-medium">Categories</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-mm transition-colors ${selectedCategories.includes(category.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {category.name_mm}
                        </button>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-sm text-muted-foreground">No categories available. Create some first.</p>
                    )}
                </div>
            </div>

            {/* Status & Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Scheduled</option>
                    </select>
                </div>

                {formData.status === 'scheduled' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium flex items-center gap-2">
                            <Calendar size={16} className="text-muted-foreground" />
                            Publish Date
                        </label>
                        <input
                            type="datetime-local"
                            value={formData.published_at ? formData.published_at.slice(0, 16) : ''}
                            onChange={(e) => setFormData({ ...formData, published_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                            className="w-full p-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                )}

                <div className="space-y-2 flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors w-full">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-5 h-5 rounded border-primary text-primary focus:ring-primary/20"
                        />
                        <span className="font-medium">Featured Post</span>
                    </label>
                </div>
            </div>

            {/* Attachments Section */}
            <div className="p-6 border border-border rounded-xl bg-muted/10">
                <h3 className="font-bold mb-4 text-lg">Attachments</h3>
                {initialData?.id ? (
                    <AttachmentManager postId={initialData.id} initialAttachments={initialData.attachments} />
                ) : (
                    <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-800">
                        Save the post first to add attachments.
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-border sticky bottom-0 bg-background p-4 z-10 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] justify-end">
                <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors flex items-center gap-2"
                >
                    <Eye size={20} />
                    Preview
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {initialData?.id ? 'Update Post' : 'Create Post'}
                </button>
            </div>

            <PostPreview
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                data={formData}
            />
        </form>
    );
}
