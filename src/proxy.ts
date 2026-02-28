import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('tc_access_token')?.value;
    const refreshToken = request.cookies.get('tc_refresh_token')?.value;

    const isExpired = (token: string) => {
        try {
            const base64Url = token.split('.')[1];
            if (!base64Url) return true;
            
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const payload = JSON.parse(jsonPayload);
            return Date.now() >= (payload.exp * 1000) - 30000;
        } catch {
            return true;
        }
    };

    let response = NextResponse.next();

    if ((!accessToken || isExpired(accessToken)) && refreshToken) {
        try {
            const res = await fetch(`${process.env.OAUTH_URI}/connect/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ClientId: process.env.OAUTH_ID,
                    ClientSecret: process.env.OAUTH_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                })
            });
            
            const data = await res.json();

            if (res.ok && data.data?.access_token) {
                request.cookies.set('tc_access_token', data.data.access_token);
                if (data.data.refresh_token) {
                    request.cookies.set('tc_refresh_token', data.data.refresh_token);
                }

                response = NextResponse.next({
                    request: {
                        headers: request.headers,
                    }
                });

                response.cookies.set('tc_access_token', data.data.access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    expires: new Date(Date.now() + data.data.expires_in * 1000)
                });
                
                if (data.data.refresh_token) {
                    response.cookies.set('tc_refresh_token', data.data.refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        path: '/',
                    });
                }
            } else {
                 response.cookies.delete('tc_access_token');
                 response.cookies.delete('tc_refresh_token');
            }
        } catch (error) {
            console.error('Middleware silent refresh error:', error);
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
