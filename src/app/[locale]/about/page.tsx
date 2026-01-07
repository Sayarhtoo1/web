export const runtime = 'edge';
import { Heart, BookOpen, Smartphone, Users } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    return (
        <div className="min-h-screen bg-background relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-10 w-64 h-64 opacity-[0.02] rotate-12">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>
                <div className="absolute bottom-40 right-10 w-80 h-80 opacity-[0.02] -rotate-12">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-gradient-to-r from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))/80] text-white py-16 md:py-24 relative overflow-hidden">
                {/* Header Decorations */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-4 right-10 w-32 h-32">
                        <Image src="/assets/hero/lantern.svg" alt="" fill className="object-contain" />
                    </div>
                    <div className="absolute top-10 right-48 w-16 h-16">
                        <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                    </div>
                    <div className="absolute bottom-4 right-24 w-20 h-20">
                        <Image src="/assets/hero/moon.svg" alt="" fill className="object-contain" />
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-accent" />
                        <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
                            {locale === 'en' ? '✦ Our Story ✦' : '✦ ကျွန်ုပ်တို့အကြောင်း ✦'}
                        </span>
                        <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-mm">
                        {locale === 'en' ? 'About Myanmar Muslim Oasis' : 'မြန်မာ မွတ်စလင် အိုအေစစ် အကြောင်း'}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* Bismillah Card */}
                    <div className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 mb-12 text-center shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                            <Image src="/assets/hero/corner-arabesque.svg" alt="" fill className="object-contain" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5 pointer-events-none rotate-180">
                            <Image src="/assets/hero/corner-arabesque.svg" alt="" fill className="object-contain" />
                        </div>

                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <Image src="/assets/hero/bismillah.svg" alt="Bismillah" fill className="object-contain" />
                        </div>
                        <p className="text-muted-foreground font-mm text-lg leading-relaxed max-w-2xl mx-auto">
                            {locale === 'en'
                                ? 'In the name of Allah, the Most Gracious, the Most Merciful. Welcome to Myanmar Muslim Oasis, a platform dedicated to sharing authentic Islamic knowledge with the Myanmar Muslim community and beyond.'
                                : 'အနန္တဂရုဏာရှင်ဖြစ်တော်မူသော၊ အလွန်သနားကြင်နာတော်မူသော အလ္လာဟ်အရှင်မြတ်၏ နာမတော်ဖြင့် မင်္ဂလာပါ။'}
                        </p>
                    </div>

                    {/* Mission Statement */}
                    <div className="prose prose-lg max-w-none font-mm text-foreground/80 mb-16">
                        {locale === 'en' ? (
                            <>
                                <p className="text-xl leading-relaxed">
                                    Our mission is to provide a clean, modern, and accessible platform for learning and spiritual growth. We focus on delivering authentic Islamic content through modern technology.
                                </p>
                                <p>
                                    We provide direct access to beneficial books (PDFs) and Android applications (APKs) that can assist in daily worship, learning Arabic, and understanding the Quran and Sunnah.
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xl leading-relaxed">
                                    ကျွန်ုပ်တို့၏ ရည်ရွယ်ချက်မှာ ခေတ်မီ သပ်ရပ်ပြီး အသုံးပြုရလွယ်ကူသော မိုဘိုင်းနည်းပညာများမှတစ်ဆင့် အစ္စလာမ့်အသိပညာ ပြန့်ပွားရေးကို အထောက်အကူပြုရန် ဖြစ်ပါသည်။
                                </p>
                                <p>
                                    နေ့စဉ်ဘဝအတွက် အသုံးဝင်မည့် အစ္စလာမ့် စာအုပ်စာပေများ (PDF) နှင့် Android ဆော့ဖ်ဝဲများ (APK) ကို လွယ်ကူစွာ ဒေါင်းလုတ်ရယူနိုင်ရန် စီစဉ်ထားပါသည်။
                                </p>
                            </>
                        )}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <div className="bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))/80] flex items-center justify-center text-white mb-6 shadow-lg">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                                {locale === 'en' ? 'Authentic Knowledge' : 'မှန်ကန်သော အသိပညာ'}
                            </h3>
                            <p className="text-muted-foreground font-mm">
                                {locale === 'en'
                                    ? 'Curated Islamic content from reliable sources, following the Quran and Sunnah.'
                                    : 'ကျမ်းတော်နှင့် စွန်နာကို အခြေခံသော ယုံကြည်စိတ်ချရသော အရင်းအမြစ်များမှ အကြောင်းအရာများ။'}
                            </p>
                        </div>

                        <div className="bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center text-accent-foreground mb-6 shadow-lg">
                                <Smartphone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                                {locale === 'en' ? 'Modern Technology' : 'ခေတ်မီ နည်းပညာ'}
                            </h3>
                            <p className="text-muted-foreground font-mm">
                                {locale === 'en'
                                    ? 'Mobile-first design with easy access to apps and resources on any device.'
                                    : 'မည်သည့်စက်ပစ္စည်းတွင်မဆို လွယ်ကူစွာအသုံးပြုနိုင်သော ဒီဇိုင်း။'}
                            </p>
                        </div>

                        <div className="bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                                {locale === 'en' ? 'Community Focused' : 'လူမှုအသိုင်းအဝိုင်'}
                            </h3>
                            <p className="text-muted-foreground font-mm">
                                {locale === 'en'
                                    ? 'Built for the Myanmar Muslim community, in both Burmese and English.'
                                    : 'မြန်မာ မွတ်စလင်အသိုင်းအဝိုင်းအတွက် မြန်မာဘာသာနှင့် အင်္ဂလိပ်ဘာသာ နှစ်မျိုးစလုံးဖြင့်။'}
                            </p>
                        </div>

                        <div className="bg-card border border-border/50 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-500">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                                {locale === 'en' ? 'Free & Open' : 'အခမဲ့ ဖြစ်ပါသည်'}
                            </h3>
                            <p className="text-muted-foreground font-mm">
                                {locale === 'en'
                                    ? 'All resources are free forever. Knowledge should be accessible to everyone.'
                                    : 'အရင်းအမြစ်များအားလုံး အခမဲ့ဖြစ်ပြီး လူတိုင်းအတွက် ရယူနိုင်ပါသည်။'}
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-muted-foreground font-mm mb-6 text-lg">
                            {locale === 'en'
                                ? 'Thank you for being part of our journey. May Allah bless you.'
                                : 'ဝင်ရောက် လေ့လာသူ အားလုံးကို အထူးကျေးဇူးတင်ရှိပါသည်။'}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))] hover:from-[hsl(var(--accent))] hover:to-[hsl(var(--hero-teal))] text-white font-bold transition-all duration-500 shadow-xl"
                        >
                            {locale === 'en' ? 'Start Exploring' : 'စတင်လေ့လာရန်'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
