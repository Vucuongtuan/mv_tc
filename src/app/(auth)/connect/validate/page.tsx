import { Suspense } from "react";
import ValidateClient from "./ValidateClient";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ code?: string, callback?: string, type?: string }>;
}

async function ValidateWrapper({ searchParams }: PageProps) {
    const params = await searchParams;
    const { code, callback, type } = params;
    
    // If we have a code, it's a callback from OAuth, proceed to validation
    if (code) {
        // Determine action type based on context, default to login/register completion
        const actionType = type || 'login'; 
        return <ValidateClient code={code} callback={callback} type={actionType} />;
    }

    // If type is logout, use client to call server action to clear cookies
    if (type === 'logout') {
        return <ValidateClient type="logout" callback={callback} />;
    }

    // If type is refresh, let client handle refresh logic
    // Or we could redirect to API route, but client handling provides better UX/feedback?
    // User requested: "nếu token hết hạn thòi gửi tc_refesh_token để lấy accesstoken mới (/api/auth/refresh)"
    // The client can call this API.
    if (type === 'refresh') {
         return <ValidateClient type="refresh" callback={callback} />;
    }

    // Initiating Login Flow
    if (type === 'login' || !type) {
        const authUrl = new URL(process.env.NEXT_PUBLIC_PATH_AUTH!);
        if (callback) {
            authUrl.searchParams.set('callback', callback);
        }
        redirect(authUrl.toString());
    }

    // Initiating Register Flow
    if (type === 'register') {
        const authUrl = new URL(process.env.NEXT_PUBLIC_PATH_AUTH!);
        authUrl.pathname = '/register';
        // Ensure client_id is preserved, usually it is present in NEXT_PUBLIC_PATH_AUTH
        if (callback) {
            authUrl.searchParams.set('callback', callback);
        }
        redirect(authUrl.toString());
    }

    return <ValidateClient code={code} callback={callback} type={type}/>;
}

export default function ConnectValidatePage({ searchParams }: PageProps) {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Đang xử lý...</h2>
                </div>
            </div>
        }>
            <ValidateWrapper searchParams={searchParams} />
        </Suspense>
    );
}
