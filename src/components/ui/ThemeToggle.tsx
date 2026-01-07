"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    // Avoid hydration mismatch
    if (!mounted) {
        return (
            <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
                <Sun size={18} className="text-foreground/70" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {theme === "light" ? (
                <Moon size={18} className="text-foreground/70 hover:text-foreground transition-colors" />
            ) : (
                <Sun size={18} className="text-foreground/70 hover:text-foreground transition-colors" />
            )}
        </button>
    );
}
