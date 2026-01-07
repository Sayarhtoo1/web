"use client";

import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link2, Image, Quote, Code, Upload } from "lucide-react";
import { useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface MarkdownToolbarProps {
    textareaId: string;
    onInsert: (before: string, after: string) => void;
}

export default function MarkdownToolbar({ textareaId, onInsert }: MarkdownToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const tools = [
        { label: "Bold", icon: Bold, before: "**", after: "**", title: "Bold (Ctrl+B)" },
        { label: "Italic", icon: Italic, before: "*", after: "*", title: "Italic (Ctrl+I)" },
        { label: "H1", icon: Heading1, before: "# ", after: "", title: "Heading 1" },
        { label: "H2", icon: Heading2, before: "## ", after: "", title: "Heading 2" },
        { label: "Bullet List", icon: List, before: "- ", after: "", title: "Bullet List" },
        { label: "Numbered List", icon: ListOrdered, before: "1. ", after: "", title: "Numbered List" },
        { label: "Link", icon: Link2, before: "[", after: "](url)", title: "Insert Link" },
        { label: "Quote", icon: Quote, before: "> ", after: "", title: "Block Quote" },
        { label: "Code", icon: Code, before: "`", after: "`", title: "Inline Code" },
    ];

    const handleClick = (before: string, after: string) => {
        const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        onInsert(before + selectedText + after, "");

        // Focus back on textarea
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            handleClick(`![${file.name}](${publicUrl})`, "");
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 rounded-t-lg border border-border border-b-0">
            {tools.map((tool) => (
                <button
                    key={tool.label}
                    type="button"
                    onClick={() => handleClick(tool.before, tool.after)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    title={tool.title}
                >
                    <tool.icon size={16} />
                </button>
            ))}

            {/* Image Upload Button */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                title="Upload Image"
            >
                <Image size={16} />
            </button>
        </div>
    );
}
