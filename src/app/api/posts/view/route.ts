import { createClient } from '@/lib/supabase/server';
export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Increment view count
        const { error } = await supabase.rpc('increment_view_count', { post_slug: slug });

        if (error) {
            // Fallback: direct update if RPC doesn't exist
            await supabase
                .from('posts')
                .update({ view_count: supabase.rpc('increment', { x: 1 }) })
                .eq('slug', slug);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}
