'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleAuthAction({ code, callback, type }: { code?: string, callback?: string, type?: string }) {
    const actionType = type || 'login';
    let targetUrl = callback || '/';

    if (actionType === 'login' || actionType === 'register') {
        if (!code) {
             return { error: 'Code is required for authentication' };
        }

        try {
            const res = await fetch(`${process.env.OAUTH_URI}/connect/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ClientId: process.env.OAUTH_ID,
                    ClientSecret: process.env.OAUTH_SECRET,
                    Code: code,
                    grant_type: 'authorization_code',
                })
            });

            const data = await res.json();
             
            if(!data.data?.access_token){
                 console.error("Token exchange failed:", data);
                 return { error: data.error || 'Access token is required for login' };
            }

            const cookieStore = await cookies();
            cookieStore.set('tc_access_token', data.data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                expires: new Date(Date.now() + data.data.expires_in * 1000)
            });
            
            if (data.data.refresh_token) {
                 cookieStore.set('tc_refresh_token', data.data.refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                });
            }

        } catch (error) {
            console.error("Auth process error:", error);
            return { error: 'Internal server error during authentication' };
        }
        
        // Redirect phải nằm ngoài try-catch
        redirect(targetUrl);

    } else if (actionType === 'logout') {
        const cookieStore = await cookies();
        cookieStore.delete('tc_access_token');
        cookieStore.delete('tc_refresh_token');
        redirect('/');
    }

    redirect(targetUrl);
}

// Thêm một action để check auth từ Server vì tc_access_token là httpOnly
export async function checkServerAuth() {
    const cookieStore = await cookies();
    return cookieStore.has('tc_access_token');
}
