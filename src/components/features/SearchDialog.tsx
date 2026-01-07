"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, FolderOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface SearchResult {
    id: string;
    slug: string;
    title_mm: string;
    title_en: string | null;
    excerpt_mm: string | null;
    type: "post" | "category";
}

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const locale = useLocale();
    const supabase = createClient();

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
            setResults([]);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    // Search function
    const handleSearch = async (searchQuery: string) => {
        setQuery(searchQuery);

        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            // Search posts
            const { data: posts } = await supabase
                .from("posts")
                .select("id, slug, title_mm, title_en, excerpt_mm")
                .eq("status", "published")
                .or(`title_mm.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%,content_mm.ilike.%${searchQuery}%`)
                .limit(5);

            // Search categories
            const { data: categories } = await supabase
                .from("categories")
                .select("id, slug, name_mm, name_en")
                .or(`name_mm.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`)
                .limit(3);

            const searchResults: SearchResult[] = [
                ...(posts?.map(p => ({
                    id: p.id,
                    slug: p.slug,
                    title_mm: p.title_mm,
                    title_en: p.title_en,
                    excerpt_mm: p.excerpt_mm,
                    type: "post" as const,
                })) || []),
                ...(categories?.map(c => ({
                    id: c.id,
                    slug: c.slug,
                    title_mm: c.name_mm,
                    title_en: c.name_en,
                    excerpt_mm: null,
                    type: "category" as const,
                })) || []),
            ];

            setResults(searchResults);
        } catch (error) {
            console.error("Search error:", error);
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative w-full max-w-2xl mx-4 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-200">
                {/* Search Input */}
                <div className="relative flex items-center border-b border-border">
                    <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={locale === "en" ? "Search posts and categories..." : "ပို့စ်များနှင့် ကဏ္ဍများ ရှာဖွေရန်..."}
                        className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-lg font-mm placeholder:text-muted-foreground"
                    />
                    {loading && (
                        <Loader2 className="absolute right-12 w-5 h-5 text-muted-foreground animate-spin" />
                    )}
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="p-2">
                            {results.map((result) => (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.type === "post" ? `/posts/${result.slug}` : `/categories/${result.slug}`}
                                    onClick={onClose}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${result.type === "post"
                                            ? "bg-primary/10 text-primary"
                                            : "bg-blue-100 dark:bg-blue-950/30 text-blue-600"
                                        }`}>
                                        {result.type === "post" ? <FileText size={20} /> : <FolderOpen size={20} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium font-mm truncate">
                                            {locale === "en" ? (result.title_en || result.title_mm) : result.title_mm}
                                        </p>
                                        {result.excerpt_mm && (
                                            <p className="text-sm text-muted-foreground truncate font-mm">
                                                {result.excerpt_mm}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground uppercase mt-1">
                                            {result.type === "post" ? "Post" : "Category"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : query.length >= 2 && !loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-mm">
                                {locale === "en" ? "No results found" : "ရှာဖွေတွေ့ရှိချက် မရှိပါ"}
                            </p>
                        </div>
                    ) : query.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            <p className="text-sm font-mm">
                                {locale === "en" ? "Start typing to search..." : "ရှာဖွေရန် စာရိုက်ပါ..."}
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                        {locale === "en" ? "Press ESC to close" : "ပိတ်ရန် ESC နှိပ်ပါ"}
                    </span>
                    <span className="hidden sm:inline">⌘K to open</span>
                </div>
            </div>
        </div>
    );
}
