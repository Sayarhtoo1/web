import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    // First, run the intl middleware
    let response = intlMiddleware(request);

    // Create a Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Get user session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Check if the request is for an admin route (excluding login)
    const isAdminRoute = pathname.match(/^\/(my|en)\/admin/);
    const isLoginPage = pathname.match(/^\/(my|en)\/admin\/login/);

    // If accessing admin routes (except login) without auth, redirect to login
    if (isAdminRoute && !isLoginPage && !user) {
        const locale = pathname.startsWith('/en') ? 'en' : 'my';
        const loginUrl = new URL(`/${locale}/admin/login`, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access login page, redirect to dashboard
    if (isLoginPage && user) {
        const locale = pathname.startsWith('/en') ? 'en' : 'my';
        const dashboardUrl = new URL(`/${locale}/admin/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return response;
}

export const config = {
    // Match internationalized pathnames and API routes
    matcher: ['/', '/(my|en)/:path*']
};
