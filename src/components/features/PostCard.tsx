"use client";

import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface PostCardProps {
    post: any;
    locale: string;
}

export default function PostCard({ post, locale }: PostCardProps) {
    const title = locale === "en" ? (post.title_en || post.title_mm) : post.title_mm;
    const excerpt = locale === "en" ? (post.excerpt_en || post.excerpt_mm) : post.excerpt_mm;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all duration-500"
        >
            {/* Image Container */}
            <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden">
                {post.cover_image_url ? (
                    <Image
                        src={post.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="relative w-16 h-16 opacity-20">
                            <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                        </div>
                    </div>
                )}

                {/* Category Badge */}
                {post.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                        {post.category}
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Read More on Hover */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Read More <ArrowRight className="w-4 h-4" />
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={post.published_at}>
                        {format(new Date(post.published_at), 'MMMM d, yyyy')}
                    </time>
                </div>

                {/* Title */}
                <Link href={`/posts/${post.slug}`} className="block mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition-colors font-mm leading-snug line-clamp-2">
                        {title}
                    </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm line-clamp-3 font-mm leading-relaxed flex-1">
                    {excerpt}
                </p>

                {/* Read Link */}
                <div className="mt-4 pt-4 border-t border-border/30">
                    <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all"
                    >
                        {locale === 'en' ? 'Continue Reading' : 'ဆက်ဖတ်ရန်'}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
