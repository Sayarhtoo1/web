"use client";

import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { FileText, Smartphone, Loader2 } from "lucide-react";

interface DownloadFormProps {
    attachment?: {
        id: string;
        post_id: string;
        type: string;
        title_mm: string;
        title_en?: string;
        file_size?: string;
        drive_url: string;
    };
}

interface Post {
    id: string;
    title_mm: string;
    status: string;
}

export default function DownloadForm({ attachment }: DownloadFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // Form state
    const [postId, setPostId] = useState(attachment?.post_id || "");
    const [type, setType] = useState(attachment?.type || "pdf");
    const [titleMm, setTitleMm] = useState(attachment?.title_mm || "");
    const [titleEn, setTitleEn] = useState(attachment?.title_en || "");
    const [fileSize, setFileSize] = useState(attachment?.file_size || "");
    const [driveUrl, setDriveUrl] = useState(attachment?.drive_url || "");

    useEffect(() => {
        const fetchPosts = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("posts")
                .select("id, title_mm, status")
                .order("created_at", { ascending: false });
            setPosts(data || []);
            setLoadingPosts(false);
        };
        fetchPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!postId) {
            alert("Please select a post to attach this download to.");
            return;
        }

        if (!titleMm || !driveUrl) {
            alert("Please fill in required fields (Title in Burmese, Drive URL)");
            return;
        }

        setIsSubmitting(true);
        const supabase = createClient();

        const attachmentData = {
            post_id: postId,
            type,
            title_mm: titleMm,
            title_en: titleEn || null,
            file_size: fileSize || null,
            drive_url: driveUrl,
        };

        let error;
        if (attachment?.id) {
            // Update existing
            const result = await supabase
                .from("attachments")
                .update(attachmentData)
                .eq("id", attachment.id);
            error = result.error;
        } else {
            // Create new
            const result = await supabase
                .from("attachments")
                .insert(attachmentData);
            error = result.error;
        }

        if (error) {
            alert("Failed to save download: " + error.message);
            setIsSubmitting(false);
            return;
        }

        router.push("/admin/downloads");
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Post Selection */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Attach to Post <span className="text-red-500">*</span>
                </label>
                {loadingPosts ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading posts...
                    </div>
                ) : (
                    <select
                        value={postId}
                        onChange={(e) => setPostId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mm"
                        required
                    >
                        <option value="">Select a post...</option>
                        {posts.map((post) => (
                            <option key={post.id} value={post.id}>
                                {post.title_mm} ({post.status})
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Type Selection */}
            <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <div className="flex gap-4">
                    <label className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${type === 'pdf'
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                            : 'border-border hover:border-muted-foreground'
                        }`}>
                        <input
                            type="radio"
                            name="type"
                            value="pdf"
                            checked={type === 'pdf'}
                            onChange={(e) => setType(e.target.value)}
                            className="sr-only"
                        />
                        <FileText className={type === 'pdf' ? 'text-red-500' : 'text-muted-foreground'} />
                        <span className="font-medium">PDF Book</span>
                    </label>
                    <label className={`flex-1 flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${type === 'apk'
                            ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                            : 'border-border hover:border-muted-foreground'
                        }`}>
                        <input
                            type="radio"
                            name="type"
                            value="apk"
                            checked={type === 'apk'}
                            onChange={(e) => setType(e.target.value)}
                            className="sr-only"
                        />
                        <Smartphone className={type === 'apk' ? 'text-green-500' : 'text-muted-foreground'} />
                        <span className="font-medium">Android APK</span>
                    </label>
                </div>
            </div>

            {/* Title in Burmese */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Title (Burmese) <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={titleMm}
                    onChange={(e) => setTitleMm(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors font-mm"
                    placeholder="ဥပမာ: စာအုပ်အမည်"
                    required
                />
            </div>

            {/* Title in English (Optional) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Title (English) <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g., Book Title"
                />
            </div>

            {/* File Size (Optional) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    File Size <span className="text-muted-foreground text-xs">(Optional)</span>
                </label>
                <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g., 2.5 MB"
                />
            </div>

            {/* Drive URL */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Download URL <span className="text-red-500">*</span>
                </label>
                <input
                    type="url"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="https://drive.google.com/..."
                    required
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Paste a Google Drive, Dropbox, or direct download link
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        attachment?.id ? 'Update Download' : 'Create Download'
                    )}
                </button>
            </div>
        </form>
    );
}
