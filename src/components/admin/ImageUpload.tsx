"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useRef } from "react";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
    placeholder?: string;
}

export default function ImageUpload({ value, onChange, className = "", placeholder }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error: any) {
            console.error(error);
            alert("Error uploading image: " + error.message);
        } finally {
            setLoading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                className="hidden"
            />

            {!value ? (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    ) : (
                        <>
                            <div className="p-3 rounded-full bg-muted text-muted-foreground">
                                <Upload size={24} />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                {placeholder || "Click to upload cover image"}
                            </span>
                        </>
                    )}
                </button>
            ) : (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border bg-muted group">
                    <img
                        src={value}
                        alt="Uploaded image"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.open(value, '_blank')}
                            className="p-2 bg-white/10 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm"
                            title="View"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2 bg-red-500/80 text-white hover:bg-red-500 rounded-lg backdrop-blur-sm"
                            title="Remove"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
