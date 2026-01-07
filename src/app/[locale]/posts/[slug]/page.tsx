import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AttachmentList from '@/components/features/AttachmentList';
import { Link } from '@/i18n/routing';
import { Metadata } from 'next';
import { ArrowLeft, Share2, Eye } from 'lucide-react';
import ViewTracker from '@/components/features/ViewTracker';
import PostCard from '@/components/features/PostCard';

// Generate dynamic metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('title_mm, title_en, excerpt_mm, excerpt_en, cover_image_url')
        .eq('slug', decodedSlug)
        .eq('status', 'published')
        .single();

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const title = locale === 'en' ? (post.title_en || post.title_mm) : post.title_mm;
    const description = locale === 'en'
        ? (post.excerpt_en || post.excerpt_mm || '')
        : (post.excerpt_mm || '');

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            images: post.cover_image_url ? [post.cover_image_url] : [],
            locale: locale === 'en' ? 'en_US' : 'my_MM',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.cover_image_url ? [post.cover_image_url] : [],
        },
    };
}

export default async function PostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('posts')
        .select('*, attachments(*), post_categories(categories(name_mm, name_en, slug))')
        .eq('slug', decodedSlug)
        .single();

    if (!post) {
        notFound();
    }

    const title = locale === 'en' ? (post.title_en || post.title_mm) : post.title_mm;
    const content = locale === 'en' ? (post.content_en || post.content_mm) : post.content_mm;
    const categoryIds = post.post_categories?.map((pc: any) => pc.category_id).filter(Boolean) || [];
    const categories = post.post_categories?.map((pc: any) => pc.categories).filter(Boolean) || [];

    // Fetch related posts
    let relatedPosts = null;
    if (categoryIds.length > 0) {
        const { data } = await supabase
            .from('posts')
            .select('*, post_categories!inner(category_id)')
            .in('post_categories.category_id', categoryIds)
            .neq('id', post.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(3);
        relatedPosts = data;
    }

    return (
        <div className="bg-background min-h-screen pb-32">
            {/* Track view on client side */}
            <ViewTracker slug={slug} />
            {/* Header / Title Area */}
            <header className="pt-24 md:pt-32 pb-12 bg-secondary/10 relative">
                <div className="absolute inset-0 bg-islamic-pattern opacity-5 pointer-events-none" />
                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft size={16} />
                        {locale === 'en' ? 'Back to Home' : 'ပင်မစာမျက်နှာသို့'}
                    </Link>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map((cat: any) => (
                                <Link
                                    key={cat.slug}
                                    href={`/categories/${cat.slug}`}
                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mm hover:bg-primary/20 transition-colors"
                                >
                                    {locale === 'en' ? (cat.name_en || cat.name_mm) : cat.name_mm}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        {post.published_at && (
                            <time>{format(new Date(post.published_at), 'MMMM d, yyyy')}</time>
                        )}
                        {post.view_count !== undefined && post.view_count > 0 && (
                            <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.view_count.toLocaleString()} {locale === 'en' ? 'views' : 'ကြည့်ရှုမှု'}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground font-mm leading-tight">
                        {title}
                    </h1>
                </div>
            </header>

            {/* Full Width Image (if available) */}
            {post.cover_image_url && (
                <div className="w-full h-[50vh] md:h-[60vh] relative mb-16 bg-muted">
                    <Image
                        src={post.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Content Container */}
            <div className="container mx-auto px-4 max-w-3xl">
                <article className="prose prose-lg prose-slate mx-auto dark:prose-invert font-mm prose-headings:font-mm prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-accent">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || ''}
                    </ReactMarkdown>
                </article>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {locale === 'en' ? 'Share this article' : 'ဤဆောင်းပါးကို မျှဝေရန်'}
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                            <Share2 size={18} className="text-foreground/70" />
                        </button>
                    </div>
                </div>

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-border">
                        <h3 className="text-2xl font-bold text-foreground font-mm mb-6">
                            {locale === 'en' ? 'Downloads' : 'ဒေါင်းလုတ်များ'}
                        </h3>
                        <AttachmentList attachments={post.attachments} locale={locale} />
                    </div>
                )}
            </div>

            {/* Related Posts Section */}
            {
                (relatedPosts && relatedPosts.length > 0) && (
                    <div className="container mx-auto px-4 max-w-6xl mt-20 border-t border-border pt-16">
                        <h3 className="text-2xl md:text-3xl font-bold font-mm mb-8 text-center md:text-left">
                            {locale === 'en' ? 'Related Articles' : 'ဆက်စပ်ဆောင်းပါးများ'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((related: any) => (
                                <PostCard key={related.id} post={related} locale={locale} />
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
