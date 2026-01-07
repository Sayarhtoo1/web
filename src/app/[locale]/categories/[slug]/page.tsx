import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import PostCard from '@/components/features/PostCard';
import { ArrowLeft, Folder, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default async function CategoryDetailPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const supabase = await createClient();

    // Fetch category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch posts in this category
    const { data: postCategories } = await supabase
        .from('post_categories')
        .select('post_id')
        .eq('category_id', category.id);

    const postIds = postCategories?.map(pc => pc.post_id) || [];

    const { data: posts } = postIds.length > 0
        ? await supabase
            .from('posts')
            .select('*')
            .in('id', postIds)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
        : { data: [] };

    const categoryName = locale === 'en' ? (category.name_en || category.name_mm) : category.name_mm;

    return (
        <div className="min-h-screen bg-background relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-64 h-64 opacity-[0.02] -rotate-12">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-gradient-to-r from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))/80] text-white py-16 md:py-24 relative overflow-hidden">
                {/* Header Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-4 right-10 w-32 h-32">
                        <Image src="/assets/hero/lantern.svg" alt="" fill className="object-contain" />
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back Link */}
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
                    >
                        <ArrowLeft size={16} />
                        {locale === 'en' ? 'All Categories' : 'ကဏ္ဍအားလုံး'}
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-accent to-transparent" />
                        <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
                            {locale === 'en' ? '✦ Category ✦' : '✦ ကဏ္ဍ ✦'}
                        </span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Folder className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-mm">
                                {categoryName}
                            </h1>
                            {category.description && (
                                <p className="mt-4 text-white/70 max-w-2xl font-mm text-lg">
                                    {category.description}
                                </p>
                            )}
                            <p className="mt-2 text-white/50 text-sm">
                                {posts?.length || 0} {locale === 'en' ? 'posts' : 'ပို့စ်'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                            {locale === 'en' ? 'No Posts Yet' : 'ပို့စ်များ မရှိသေးပါ'}
                        </h3>
                        <p className="text-muted-foreground font-mm">
                            {locale === 'en'
                                ? 'Check back soon for new content in this category.'
                                : 'ဤကဏ္ဍတွင် မကြာမီ အကြောင်းအရာသစ်များ ထည့်သွင်းပါမည်။'}
                        </p>
                        <Link
                            href="/categories"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            {locale === 'en' ? 'Browse Other Categories' : 'အခြားကဏ္ဍများ ကြည့်ရန်'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
