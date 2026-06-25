"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Provider({ children }: { children: React.ReactNode }) {
    const initAuth = useAuthStore((state) => state.initAuth);

    useEffect(() => {
        if (typeof initAuth === "function") {
            initAuth();
        }
    }, [initAuth]);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // Tab almashtirganda API'ga zapros ketmaydi
                refetchOnReconnect: false,   // Tarmoq tiklanganda zapros ketmaydi
                refetchInterval: false,      // Interval bilan zapros ketmaydi
                retry: 1,                    // Xatolik bo'lsa faqat 1 marta qayta urinib ko'radi (sukut bo'yicha 3 marta)
                staleTime: 1000 * 60 * 5,    // Ma'lumotlarni 5 daqiqa davomida keshda saqlaydi
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                toastClassName="rounded-xl! shadow-lg!"
            />

        </QueryClientProvider>
    );
}