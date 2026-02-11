'use client'

import { useEffect, useState } from "react";
import { handleAuthAction } from "./actions";
import { useRouter } from "next/navigation";

interface ValidateClientProps {
    code?: string;
    callback?: string;
    type?: string;
}

export default function ValidateClient({ code, callback, type }: ValidateClientProps) {
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const performAuth = async () => {
            try {
                if (type === 'logout') {
                    await handleAuthAction({ type: 'logout' });
                    router.push('/');
                    return;
                }

                if (type === 'refresh') {
                    const res = await fetch('/api/auth/refresh', { method: 'POST' });
                    if (res.ok) {
                        setStatus('success');
                        router.push(callback || '/');
                    } else {
                        const data = await res.json();
                        setErrorMessage(data.error || 'Refresh failed');
                        setStatus('error');
                    }
                    return;
                }
                
                if (code) {
                    const result = await handleAuthAction({ code, callback, type });
                    if (result && result.error) {
                        setStatus('error');
                        setErrorMessage(result.error);
                    } else {
                        setStatus('success');
                    }
                } else {
                     setStatus('error');
                     setErrorMessage("Invalid request: No code provided.");
                }

            } catch (error) {
                console.error("Auth Action Error:", error);
                setStatus('error');
                setErrorMessage("An unexpected error occurred.");
            }
        };

        performAuth();
    }, [code, callback, type, router]);

    if (status === 'loading') {
        let message = "Đang xử lý...";
        if (type === 'logout') message = "Đang đăng xuất...";
        if (type === 'refresh') message = "Đang làm mới phiên...";
        if (code) message = "Đang xác thực...";

        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">{message}</h2>
                    <p className="text-gray-500">Vui lòng đợi trong giây lát.</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center text-red-500">
                    <h2 className="text-xl font-semibold">Thao tác thất bại</h2>
                    <p>{errorMessage}</p>
                    <a href="/" className="mt-4 inline-block text-blue-500 hover:underline">
                        Về trang chủ
                    </a>
                    {type === 'refresh' && (
                        <a href="/connect/validate?type=login" className="mt-4 block text-blue-500 hover:underline">
                            Đăng nhập lại
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return null; 
}
