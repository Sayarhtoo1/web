"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface DeleteDownloadButtonProps {
    attachmentId: string;
    attachmentTitle: string;
}

export default function DeleteDownloadButton({ attachmentId, attachmentTitle }: DeleteDownloadButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${attachmentTitle}"? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("attachments")
            .delete()
            .eq("id", attachmentId);

        if (error) {
            alert("Failed to delete download: " + error.message);
            setIsDeleting(false);
            return;
        }

        router.refresh();
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-foreground/50 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
            title="Delete"
        >
            <Trash2 size={18} />
        </button>
    );
}
