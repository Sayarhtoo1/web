import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myanmarmuslimoasis.com';

    // Fetch all published posts
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at, published_at')
        .eq('status', 'published');

    // Fetch all categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, created_at');

    const postUrls: MetadataRoute.Sitemap = (posts || []).map((post) => ({
        url: `${baseUrl}/my/posts/${post.slug}`,
        lastModified: post.updated_at || post.published_at,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
            languages: {
                my: `${baseUrl}/my/posts/${post.slug}`,
                en: `${baseUrl}/en/posts/${post.slug}`,
            },
        },
    }));

    const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((category) => ({
        url: `${baseUrl}/my/categories/${category.slug}`,
        lastModified: category.created_at,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
            languages: {
                my: `${baseUrl}/my/categories/${category.slug}`,
                en: `${baseUrl}/en/categories/${category.slug}`,
            },
        },
    }));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
            alternates: {
                languages: {
                    my: `${baseUrl}/my`,
                    en: `${baseUrl}/en`,
                },
            },
        },
        {
            url: `${baseUrl}/my/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
                languages: {
                    my: `${baseUrl}/my/categories`,
                    en: `${baseUrl}/en/categories`,
                },
            },
        },
        {
            url: `${baseUrl}/my/downloads`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
            alternates: {
                languages: {
                    my: `${baseUrl}/my/downloads`,
                    en: `${baseUrl}/en/downloads`,
                },
            },
        },
        {
            url: `${baseUrl}/my/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
                languages: {
                    my: `${baseUrl}/my/about`,
                    en: `${baseUrl}/en/about`,
                },
            },
        },
    ];

    return [...staticPages, ...categoryUrls, ...postUrls];
}
