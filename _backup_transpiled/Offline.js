import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TopoBackground } from "@/components/layout/TopoBackground";
export function Offline() {
    const [retrying, setRetrying] = useState(false);
    useEffect(() => {
        if (!retrying)
            return;
        const t = setTimeout(() => {
            window.location.reload();
        }, 600);
        return () => clearTimeout(t);
    }, [retrying]);
    return (_jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden bg-[#F4F1EA]", children: [_jsx(TopoBackground, { variant: "warm" }), _jsxs("header", { className: "relative z-10 mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 pt-8 md:px-0", children: [_jsx(Link, { to: "/", className: "text-[18px] font-semibold tracking-tight text-[#0B2545]", children: "SiagaKeluarga" }), _jsx("p", { className: "text-[13px] font-semibold text-[#9A3412]", children: "Mode Luring | Darurat Nasional 112" })] }), _jsx("main", { className: "relative z-10 flex flex-1 items-center justify-center px-6 py-12", children: _jsxs("div", { className: "flex w-full max-w-[600px] flex-col items-center gap-[18px] rounded-[24px] border border-[#E2E8F0] bg-white px-8 py-11 text-center md:px-12", children: [_jsx("div", { className: "flex size-[72px] items-center justify-center rounded-full border-2 border-[#DC2626]", children: _jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [_jsx("span", { className: "h-5 w-0.5 rounded-full bg-[#DC2626]" }), _jsx("span", { className: "size-1 rounded-full bg-[#DC2626]" })] }) }), _jsx("h1", { className: "text-[32px] leading-tight font-bold text-[#0B2545]", children: "Tidak ada koneksi" }), _jsx("p", { className: "max-w-[480px] text-[17px] leading-[1.6] text-[#475569]", children: "Periksa koneksi internetmu. Rencana darurat tersimpan tetap bisa dibuka tanpa internet." }), _jsx("button", { type: "button", onClick: () => setRetrying(true), disabled: retrying, className: "inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-medium text-white transition-colors hover:bg-[#A3360A] disabled:opacity-60", children: retrying ? "Mencoba lagi..." : "Coba lagi" }), _jsxs("div", { className: "w-full rounded-[12px] border border-[#FDBA74] bg-[#FFF7ED] px-[18px] py-[14px] text-center", children: [_jsx("p", { className: "text-[13px] font-semibold text-[#9A3412]", children: "Rencana Darurat Tetap Tersedia Offline" }), _jsx("p", { className: "mt-1.5 text-[12px] text-[#475569]", children: "Buka salinan rencana Keluarga Pratama (Dayeuhkolot) & daftar kontak BPBD tanpa internet." })] })] }) })] }));
}
