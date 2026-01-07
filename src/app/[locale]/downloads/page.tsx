import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import AttachmentList from '@/components/features/AttachmentList';
import { Download, FileText, Smartphone, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default async function DownloadsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('Index');
    const supabase = await createClient();

    const { data: attachments } = await supabase
        .from('attachments')
        .select('*, posts!inner(status)')
        .eq('posts.status', 'published')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-background relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 right-20 w-80 h-80 opacity-[0.02] rotate-45">
                    <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                </div>
            </div>

            {/* Page Header */}
            <div className="bg-gradient-to-r from-[hsl(var(--hero-teal))] to-[hsl(var(--hero-teal))/80] text-white py-16 md:py-24 relative overflow-hidden">
                {/* Header Decorations */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-4 right-10 w-28 h-28">
                        <Image src="/assets/hero/moon.svg" alt="" fill className="object-contain" />
                    </div>
                    <div className="absolute bottom-4 right-40 w-20 h-20">
                        <Image src="/assets/hero/Star.svg" alt="" fill className="object-contain" />
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-accent to-transparent" />
                        <span className="text-accent font-bold tracking-[0.3em] text-xs uppercase">
                            {locale === 'en' ? '✦ Resources ✦' : '✦ အရင်းအမြစ်များ ✦'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-mm">
                        {locale === 'en' ? 'Downloads' : 'ဒေါင်းလုတ်များ'}
                    </h1>
                    <p className="mt-4 text-white/70 max-w-xl font-mm text-lg">
                        {locale === 'en'
                            ? 'Access free Islamic resources including books (PDFs) and mobile applications (APKs).'
                            : 'အခမဲ့ အစ္စလာမ့်စာပေများ (PDF) နှင့် မိုဘိုင်းအက်ပ်များ (APK) ကို ဒေါင်းလုတ်ရယူနိုင်ပါသည်။'}
                    </p>
                </div>
            </div>

            {/* Download Stats */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {attachments?.filter(a => a.type === 'pdf').length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {locale === 'en' ? 'PDF Books' : 'PDF စာအုပ်'}
                        </div>
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[hsl(var(--hero-teal))]/10 flex items-center justify-center text-[hsl(var(--hero-teal))]">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {attachments?.filter(a => a.type === 'apk').length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {locale === 'en' ? 'Android Apps' : 'Android အက်ပ်'}
                        </div>
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Download className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                            {attachments?.length || 0}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {locale === 'en' ? 'Total Files' : 'စုစုပေါင်း'}
                        </div>
                    </div>
                    <div className="bg-card border border-border/50 rounded-2xl p-6 text-center shadow-lg">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">100%</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {locale === 'en' ? 'Free Forever' : 'အခမဲ့'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Downloads List */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                {attachments && attachments.length > 0 ? (
                    <AttachmentList attachments={attachments} locale={locale} />
                ) : (
                    <div className="p-16 text-center bg-card rounded-2xl border border-border/50 shadow-lg">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                            <Download className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 font-mm">
                            {locale === 'en' ? 'No Downloads Available' : 'ဒေါင်းလုတ်လုပ်စရာများ မရှိသေးပါ'}
                        </h3>
                        <p className="text-muted-foreground font-mm">
                            {locale === 'en' ? 'Check back soon for new resources.' : 'မကြာမီ ပြန်လည်စစ်ဆေးပါ။'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
