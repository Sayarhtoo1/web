"use client";

import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";

interface PostPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        title_mm?: string;
        title_en?: string;
        content_mm?: string;
        content_en?: string;
        cover_image_url?: string;
        published_at?: string;
    };
}

export default function PostPreview({ isOpen, onClose, data }: PostPreviewProps) {
    if (!isOpen) return null;

    const content = data.content_mm || data.content_en || "";
    const title = data.title_mm || data.title_en || "Untitled";
    const date = data.published_at ? format(new Date(data.published_at), 'MMMM dd, yyyy') : format(new Date(), 'MMMM dd, yyyy');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-background w-full max-w-4xl h-[90vh] rounded-xl flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Preview Mode
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <article className="max-w-3xl mx-auto">
                        <header className="mb-8 text-center">
                            {data.cover_image_url && (
                                <div className="rounded-2xl overflow-hidden mb-8 shadow-lg aspect-video relative">
                                    <img
                                        src={data.cover_image_url}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold font-mm mb-4 leading-relaxed">
                                {title}
                            </h1>
                            <div className="text-muted-foreground">
                                {date}
                            </div>
                        </header>

                        <div className="prose prose-lg dark:prose-invert max-w-none font-mm/relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
