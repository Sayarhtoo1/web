"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
    slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
    useEffect(() => {
        // Only track once per session per post
        const viewedKey = `viewed_${slug}`;
        if (sessionStorage.getItem(viewedKey)) {
            return;
        }

        // Track the view
        fetch("/api/posts/view", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
        }).then(() => {
            sessionStorage.setItem(viewedKey, "1");
        }).catch(() => {
            // Silently fail - view tracking is not critical
        });
    }, [slug]);

    return null;
}
