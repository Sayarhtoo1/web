import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import PostCard from '@/components/features/PostCard';
import HeroSection from '@/components/features/Hero/HeroSection'; // New Component
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Index');
    const supabase = await createClient();

    // Fetch Featured Post
    const { data: featuredPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(1);

    const featuredPost = featuredPosts?.[0];

    // Fetch Latest Posts
    let query = supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

    if (featuredPost) {
        query = query.neq('id', featuredPost.id);
    }

    const { data: latestPosts } = await query;

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* New Luxury Greeting-Card Style Hero */}
            <HeroSection locale={locale} featuredPost={featuredPost} />

            {/* Latest Posts Section */}
            <section className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
                {/* Decorative Background Star */}
                <div className="absolute top-10 left-0 w-64 h-64 opacity-[0.02] pointer-events-none -rotate-12">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>

                <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-border/40 pb-6 gap-6">
                    <div>
                        <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                            <Image src="/assets/hero/Star.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-60" />
                            Fresh Content
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold font-mm text-foreground">
                            {t('latestPosts')}
                        </h2>
                    </div>
                    <Link
                        href="/categories"
                        className="hidden md:inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all"
                    >
                        View Archive
                        <BookOpen className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts?.map((post) => (
                        <PostCard key={post.id} post={post} locale={locale} />
                    ))}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[hsl(var(--hero-teal))] text-white font-bold hover:bg-[hsl(var(--hero-teal))/90] transition-colors shadow-lg"
                    >
                        View All Posts
                        <BookOpen className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
