import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
function CountUpStat({ target }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-10% 0px" });
    const reduce = useReducedMotion();
    const [val, setVal] = useState(reduce ? target : 0);
    useEffect(() => {
        if (!inView || reduce)
            return;
        const start = performance.now();
        let frame = 0;
        const tick = (now) => {
            const progress = Math.min(1, (now - start) / 900);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(eased * target));
            if (progress < 1)
                frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, reduce, target]);
    return (_jsx("span", { ref: ref, className: "tabular-nums", children: (reduce ? target : val).toLocaleString("id-ID") }));
}
export function Stats() {
    return (_jsxs("section", { className: "px-4 py-14 md:px-8 md:py-20", children: [_jsxs("div", { className: "grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16", children: [_jsx("h2", { className: "text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-[#10243F] md:text-[40px]", children: "Banyak keluarga baru berunding saat air sudah masuk rumah." }), _jsxs("div", { children: [_jsx("p", { className: "text-[17px] leading-[1.6] text-[#3E5168]", children: "Rencana tertulis memindahkan keputusan itu ke hari yang tenang: titik kumpul, tugas masing-masing, dan isi tas. Saat kejadian, yang dibaca cukup satu halaman." }), _jsx("a", { href: "#cara-kerja", className: "mt-5 inline-flex h-11 items-center text-[15px] font-semibold text-[#9A3412] underline-offset-4 hover:underline", children: "Lihat tiga langkahnya" })] })] }), _jsxs("div", { className: "mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4", children: [_jsxs("article", { className: "flex flex-col justify-between rounded-[22px] bg-white p-6", children: [_jsx("p", { className: "text-[14px] text-[#3E5168]", children: "Kejadian tercatat, 2025" }), _jsx("p", { className: "mt-8 text-[56px] leading-none font-semibold tracking-[-0.04em] text-[#10243F]", children: _jsx(CountUpStat, { target: 5402 }) }), _jsx("p", { className: "mt-4 text-[14px] leading-[1.5] text-[#3E5168]", children: "Bencana hidrometeorologi di Indonesia. Rincian yang dipakai di sini: 3.120 banjir, 1.280 cuaca ekstrem, 710 longsor. Sumber: BNPB." })] }), _jsxs("article", { className: "flex flex-col justify-between rounded-[22px] bg-[#E7F0C8] p-6", children: [_jsx("p", { className: "text-[14px] text-[#2C3B28]", children: "Yang ditulis di rencana" }), _jsx("p", { className: "mt-8 text-[56px] leading-none font-semibold tracking-[-0.04em] text-[#10243F]", children: "4" }), _jsx("p", { className: "mt-4 text-[14px] leading-[1.5] text-[#2C3B28]", children: "Titik kumpul, tugas tiap anggota, kontak darurat, dan daftar tas siaga." })] }), _jsx("article", { className: "relative min-h-[240px] overflow-hidden rounded-[22px]", children: _jsx("img", { src: "/hero/aman.webp", alt: "Rumah dan sawah tergenang, dilihat dari jalur yang lebih tinggi", className: "absolute inset-0 size-full object-cover object-[72%_40%]" }) }), _jsxs("article", { className: "flex flex-col justify-between rounded-[22px] bg-[#10243F] p-6 text-white", children: [_jsx("p", { className: "text-[14px] text-[#C9D3E0]", children: "Pembaruan prakiraan" }), _jsx("p", { className: "mt-8 text-[56px] leading-none font-semibold tracking-[-0.04em]", children: "3 jam" }), _jsx("p", { className: "mt-4 text-[14px] leading-[1.5] text-[#C9D3E0]", children: "Cuaca mengikuti kelurahan rumah yang kamu isi, dengan kredit sumber BMKG di halamannya." })] })] }), _jsxs("ul", { className: "mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-[#5C6B7C]", children: [_jsx("li", { children: "Cuaca: BMKG" }), _jsx("li", { children: "Kejadian: BNPB" }), _jsx("li", { children: "Saat kejadian: ikuti BPBD dan petugas di tempat" })] })] }));
}
