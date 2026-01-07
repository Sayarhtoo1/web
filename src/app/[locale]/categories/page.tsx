import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Folder, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from('categories')
        .select('*, post_categories(count)')
        .order('name_mm');

    return (
        <div className="min-h-screen bg-background relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 opacity-[0.02] rotate-12">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>
                <div className="absolute bottom-20 right-10 w-96 h-96 opacity-[0.02] -rotate-12">
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-accent to-transparent" />
                        <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
                            {locale === 'en' ? '✦ Browse Topics ✦' : '✦ ခေါင်းစဉ်များ ✦'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-mm">
                        {locale === 'en' ? 'Categories' : 'ကဏ္ဍများ'}
                    </h1>
                    <p className="mt-4 text-white/70 max-w-xl font-mm text-lg">
                        {locale === 'en'
                            ? 'Explore our curated collection of Islamic knowledge, organized by topic.'
                            : 'အစ္စလာမ့်အသိပညာများကို အကြောင်းအရာအလိုက် လေ့လာနိုင်ပါသည်။'}
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories?.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group relative flex flex-col p-8 bg-card border border-border/50 rounded-2xl hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 overflow-hidden"
                        >
                            {/* Hover Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Icon */}
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))/80] flex items-center justify-center text-white mb-6 shadow-lg shadow-teal-900/20 group-hover:scale-110 transition-transform duration-500">
                                <Folder size={28} />
                            </div>

                            {/* Content */}
                            <div className="relative flex-1">
                                <h2 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors font-mm mb-2">
                                    {locale === 'en' ? (category.name_en || category.name_mm) : category.name_mm}
                                </h2>
                                {category.description && (
                                    <p className="text-muted-foreground text-sm font-mm line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>

                            {/* Arrow */}
                            <div className="relative flex items-center gap-2 mt-6 text-accent text-sm font-bold group-hover:gap-3 transition-all">
                                {locale === 'en' ? 'Explore' : 'ဝင်ကြည့်ရန်'}
                                <ArrowRight className="w-4 h-4" />
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
                                <Image src="/assets/hero/corner-arabesque.svg" alt="" fill className="object-contain" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {(!categories || categories.length === 0) && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                            {locale === 'en' ? 'No Categories Yet' : 'ကဏ္ဍများ မရှိသေးပါ'}
                        </h3>
                        <p className="text-muted-foreground font-mm">
                            {locale === 'en' ? 'Check back soon for new content.' : 'မကြာမီ ပြန်လည်စစ်ဆေးပါ။'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
