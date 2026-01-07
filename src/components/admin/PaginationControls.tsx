"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalPages: number;
    currentPage: number;
}

export default function PaginationControls({ hasNextPage, hasPrevPage, totalPages, currentPage }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                disabled={!hasPrevPage}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted text-muted-foreground"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                disabled={!hasNextPage}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
