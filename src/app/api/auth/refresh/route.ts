import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('tc_refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'Refresh token is required' }, { status: 401 });
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
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.error || 'Failed to refresh token' }, { status: res.status });
        }

        if(!data.data.access_token){
             return NextResponse.json({ error: 'Access token not found in response' }, { status: 500 });
        }

        const response = NextResponse.json({ success: true });

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

        return response;

    } catch (error) {
        console.error("RefreshToken Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
