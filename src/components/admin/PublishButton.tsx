"use client";

import { Send, FileX, Loader2 } from "lucide-react";
import { useState } from "react";
import { publishPost, unpublishPost } from "@/lib/actions";
import { useRouter } from "@/i18n/routing";

interface PublishButtonProps {
    postId: string;
    currentStatus: string;
}

export default function PublishButton({ postId, currentStatus }: PublishButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);

        const result = currentStatus === 'published'
            ? await unpublishPost(postId)
            : await publishPost(postId);

        if (result.success) {
            router.refresh();
        } else {
            alert("Error: " + result.error);
        }

        setLoading(false);
    };

    if (currentStatus === 'published') {
        return (
            <button
                onClick={handleToggle}
                className="p-2 text-amber-500/70 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors rounded-lg"
                title="Unpublish (move to draft)"
                disabled={loading}
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <FileX size={18} />}
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            className="p-2 text-emerald-500/70 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors rounded-lg"
            title="Publish now"
            disabled={loading}
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
    );
}
