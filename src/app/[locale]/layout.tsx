import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "@/app/globals.css";
import localFont from "next/font/local";
import { Noto_Naskh_Arabic } from "next/font/google"; // Keeping Arabic for specific use if needed
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Custom Variable Font (Supports both Burmese and English)
const mainFont = localFont({
    src: '../../../public/assets/fonts/KoZ032Uni-VF.ttf',
    display: 'swap',
    variable: '--font-sans', // Primary font for the site
});

// Keeping Arabic for specific Quranic/Arabic text
const notoNaskhArabic = Noto_Naskh_Arabic({
    weight: ["400", "700"],
    subsets: ["arabic"],
    variable: "--font-arabic"
});

export const metadata = {
    title: {
        default: "Myanmar Muslim Oasis",
        template: "%s | Myanmar Muslim Oasis",
    },
    description: "A Personal Islamic Blog - Authentic Islamic knowledge for the Myanmar Muslim community",
    keywords: ["Islamic", "Myanmar", "Muslim", "Blog", "Quran", "Sunnah", "Islamic knowledge"],
    authors: [{ name: "Myanmar Muslim Oasis" }],
    openGraph: {
        title: "Myanmar Muslim Oasis",
        description: "Authentic Islamic knowledge for the Myanmar Muslim community",
        type: "website",
        locale: "my_MM",
        alternateLocale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Myanmar Muslim Oasis",
        description: "Authentic Islamic knowledge for the Myanmar Muslim community",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning className="scroll-smooth">
            <body
                className={`${mainFont.variable} ${notoNaskhArabic.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
                style={{ '--font-mm': 'var(--font-sans)' } as React.CSSProperties}
            >
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
