"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Plus, Trash, Loader2, ExternalLink } from "lucide-react";

interface Attachment {
    id: string;
    type: string;
    title_mm: string;
    drive_url: string;
}

export default function AttachmentManager({ postId, initialAttachments = [] }: { postId: string, initialAttachments?: Attachment[] }) {
    const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments || []);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title_mm: "",
        type: "apk",
        drive_url: "",
    });
    const supabase = createClient();

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Auto-detect file size logic could go here (e.g. valid drive link check), skipping for MVP

        const { data, error } = await supabase.from("attachments").insert({
            post_id: postId,
            title_mm: formData.title_mm,
            title_en: formData.title_mm, // Fallback
            type: formData.type,
            drive_url: formData.drive_url,
            file_size: "Unknown" // Placeholder
        }).select().single();

        if (error) {
            alert(error.message);
        } else {
            setAttachments([...attachments, data]);
            setFormData({ title_mm: "", type: "apk", drive_url: "" });
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this attachment?")) return;
        const { error } = await supabase.from("attachments").delete().eq("id", id);
        if (!error) {
            setAttachments(attachments.filter(a => a.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {attachments.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-3 bg-card border rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="uppercase text-xs font-bold bg-muted px-2 py-1 rounded">{att.type}</span>
                            <span className="font-medium font-mm">{att.title_mm}</span>
                            <a href={att.drive_url} target="_blank" className="text-primary hover:underline flex items-center gap-1 text-xs">
                                Link <ExternalLink size={10} />
                            </a>
                        </div>
                        <button
                            onClick={() => handleDelete(att.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <form onSubmit={handleAdd} className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
                <h4 className="font-medium text-sm">Add New Attachment</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Title (e.g. APK v1.0)"
                        required
                        value={formData.title_mm}
                        onChange={e => setFormData({ ...formData, title_mm: e.target.value })}
                        className="p-2 rounded border bg-background font-mm"
                    />
                    <select
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                        className="p-2 rounded border bg-background"
                    >
                        <option value="apk">APK</option>
                        <option value="pdf">PDF</option>
                        <option value="zip">ZIP</option>
                    </select>
                    <input
                        type="url"
                        placeholder="Google Drive Link"
                        required
                        value={formData.drive_url}
                        onChange={e => setFormData({ ...formData, drive_url: e.target.value })}
                        className="p-2 rounded border bg-background"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                    {loading ? "Adding..." : "Add Attachment"}
                </button>
            </form>
        </div>
    );
}
