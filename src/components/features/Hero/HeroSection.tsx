"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight, Search } from "lucide-react";

export default function HeroSection({
    locale,
    featuredPost,
}: {
    locale: string;
    featuredPost: any;
}) {
    return (
        <section className="relative w-full min-h-[85vh] lg:h-screen flex flex-col lg:flex-row overflow-hidden bg-[hsl(var(--hero-cream))]">

            {/* === LEFT SIDE (Mobile: TOP BANNER) === */}
            {/* Changed height from 35vh to 25vh for tighter mobile look */}
            <div className="relative w-full lg:w-[25%] h-[25vh] lg:h-full bg-[hsl(var(--hero-teal))] overflow-hidden flex items-center justify-center">


                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />

                {/* Left Side Content - Hidden on mobile to reduce clutter, visible on Desktop */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute bottom-12 left-0 right-0 z-10 p-8 text-center hidden lg:block"
                >
                    <h2 className="text-white/60 font-mm text-sm md:text-base leading-relaxed tracking-[0.2em] uppercase">
                        {locale === 'en' ? 'Authentic Knowledge' : 'မှန်ကန်သော အသိပညာ'}
                    </h2>
                </motion.div>



                {/* Vertical Divider Line (Desktop only) */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-accent/20 via-accent to-accent/20 h-full z-20" />
            </div>

            {/* === RIGHT SIDE (Mobile: CONTENT BODY) === */}
            <div className="relative w-full lg:w-[75%] h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-12 lg:py-0">

                {/* Premium Subtle Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/[0.02] to-transparent pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                {/* HANGING ORNAMENTS - Hidden on mobile to simplify header */}
                <div className="hidden lg:flex absolute top-0 right-0 left-0 h-40 pointer-events-none z-10 justify-end pr-20 gap-12">
                    {/* Lantern 1 */}
                    <motion.div
                        initial={{ y: -100 }} animate={{ y: 0, rotate: [0, 2, -2, 0] }}
                        transition={{
                            y: { duration: 1, type: "spring", bounce: 0.3 },
                            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="relative w-16 h-48 origin-top"
                    >
                        <Image src="/assets/hero/lantern.svg" alt="Lantern" fill className="object-contain drop-shadow-xl" />
                    </motion.div>

                    {/* Star - New Addition */}
                    <motion.div
                        initial={{ y: -100 }} animate={{ y: 0, rotate: [0, -3, 3, 0] }}
                        transition={{
                            y: { duration: 1, delay: 0.1, type: "spring", bounce: 0.3 },
                            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                        }}
                        className="relative w-12 h-32 origin-top mt-[-15px]"
                    >
                        <Image src="/assets/hero/Star.svg" alt="Star" fill className="object-contain drop-shadow-lg" />
                    </motion.div>

                    {/* Moon */}
                    <motion.div
                        initial={{ y: -100 }} animate={{ y: 0, rotate: [0, 2, -2, 0] }}
                        transition={{
                            y: { duration: 1, delay: 0.2, type: "spring", bounce: 0.3 },
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                        }}
                        className="relative w-14 h-36 origin-top mt-[-10px]"
                    >
                        <Image src="/assets/hero/moon.svg" alt="Moon" fill className="object-contain drop-shadow-lg" />
                    </motion.div>
                </div>

                {/* Mobile Ornaments - Smaller & positioned relative to Cream section */}
                {/* Mobile Ornaments - Full set with animation */}
                <div className="lg:hidden absolute top-0 right-4 flex gap-3 pointer-events-none z-10 items-start">
                    {/* Lantern */}
                    <motion.div
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-10 h-28 origin-top"
                    >
                        <Image src="/assets/hero/lantern.svg" alt="Lantern" fill className="object-contain drop-shadow-md" />
                    </motion.div>
                    {/* Star */}
                    <motion.div
                        animate={{ rotate: [0, -3, 3, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="relative w-8 h-20 origin-top -mt-2"
                    >
                        <Image src="/assets/hero/Star.svg" alt="Star" fill className="object-contain drop-shadow-md" />
                    </motion.div>
                    {/* Moon */}
                    <motion.div
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="relative w-8 h-24 origin-top"
                    >
                        <Image src="/assets/hero/moon.svg" alt="Moon" fill className="object-contain drop-shadow-md" />
                    </motion.div>
                </div>

                {/* Corner Arabesque */}
                <div className="absolute bottom-0 right-0 w-32 h-32 lg:w-64 lg:h-64 opacity-10 pointer-events-none rotate-180">
                    <Image src="/assets/hero/corner-arabesque.svg" alt="Decoration" fill className="object-contain" />
                </div>


                {/* === MAIN CONTENT === */}
                {/* Added mt-24 on mobile to clear the overlapping medallion */}
                <div className="relative z-20 space-y-8 mt-24 lg:mt-0 lg:pl-56 text-center lg:text-left">

                    {/* Greeting / Pre-title with Gold Line */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-4"
                    >
                        <div className="hidden lg:block w-12 h-[2px] bg-gradient-to-r from-accent to-transparent" />
                        <span className="text-accent font-bold tracking-[0.3em] text-xs md:text-sm uppercase font-sans">
                            {locale === 'en' ? '✦ Welcome to Oasis ✦' : '✦ မင်္ဂလာပါ ✦'}
                        </span>
                    </motion.div>

                    {/* Title with Premium Styling */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-mm leading-[1.15] tracking-tight">
                            <span className="block text-[hsl(var(--foreground))]">
                                {locale === 'en' ? 'Myanmar Muslim' : 'မြန်မာ'}
                            </span>
                            <span className="block bg-gradient-to-r from-[hsl(var(--hero-teal))] via-[hsl(var(--accent))] to-[hsl(var(--hero-teal))] bg-clip-text text-transparent">
                                {locale === 'en' ? 'Oasis' : 'မွတ်စလင် အိုအေစစ်'}
                            </span>
                        </h1>
                        {/* Decorative Gold Line under title */}
                        <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                            <div className="w-8 h-[1px] bg-accent/50" />
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <div className="w-16 h-[2px] bg-accent" />
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <div className="w-8 h-[1px] bg-accent/50" />
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-muted-foreground font-mm text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
                    >
                        {locale === 'my'
                            ? 'မှန်ကန်သော အစ္စလာမ့်စာပေများ၊ ဆောင်းပါးများ နှင့် အသိပညာများကို တစ်နေရာတည်းတွင် လေ့လာဆည်းပူးနိုင်သော နေရာ'
                            : 'Explore authentic Islamic articles, books, and insights designed to elevate your spiritual journey.'}
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start"
                    >
                        {/* Premium Search Input */}
                        <div className="relative flex-1 max-w-sm mx-auto lg:mx-0 w-full group">
                            <input
                                type="text"
                                placeholder={locale === 'en' ? "Search topics..." : "ခေါင်းစဉ်များ ရှာရန်..."}
                                className="w-full pl-12 pr-4 py-4 rounded-full bg-white border-2 border-border/40 focus:border-accent focus:ring-2 focus:ring-accent/20 shadow-lg shadow-black/5 transition-all font-mm outline-none text-foreground placeholder:text-muted-foreground/60"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent/70" />
                        </div>

                        {/* Premium CTA Button */}
                        <Link
                            href="/categories"
                            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))] hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--hero-teal))] text-white font-bold transition-all duration-500 shadow-xl shadow-teal-900/20 w-full sm:w-auto relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                {locale === 'en' ? 'Explore Library' : 'စာကြည့်တိုက်'}
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>

                </div>

            </div>

            {/* === CENTER MEDALLION (Overlap) === */}
            <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
                className="absolute left-1/2 lg:left-[25%] top-[25vh] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 drop-shadow-2xl"
            >
                {/* Medallion Shape */}
                <div className="relative w-full h-full bg-white rounded-full border-[4px] lg:border-[6px] border-[hsl(var(--accent))] shadow-[0_0_40px_rgba(214,180,107,0.3)] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-2 border-[2px] border-[hsl(var(--hero-teal))/20] rounded-full border-dashed" />

                    {/* Bismillah Calligraphy */}
                    <div className="relative w-3/4 h-3/4">
                        <Image src="/assets/hero/bismillah.svg" alt="Bismillah" fill className="object-contain" />
                    </div>
                </div>
            </motion.div>

        </section>
    );
}

