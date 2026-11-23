import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const FAQS = [
    {
        q: "Apakah ini gratis?",
        a: "Ya. Profil keluarga dan rencana darurat dasar tidak dipungut biaya.",
    },
    {
        q: "Siapa yang bisa melihat data keluarga saya?",
        a: "Isi lengkapnya hanya lewat akun kamu. Tautan yang dibagikan menampilkan bagian yang kamu pilih, dalam mode baca-saja.",
    },
    {
        q: "Apakah jawaban di sini menggantikan BPBD?",
        a: "Tidak. Rencana ini untuk bersiap. Saat kejadian berlangsung, ikuti arahan BPBD, petugas, atau sirine di tempatmu.",
    },
    {
        q: "Bagaimana cara mengirimnya ke orang tua saya?",
        a: "Di halaman rencana, pilih bagikan. Kamu mendapat tautan yang bisa dikirim lewat WhatsApp. Penerima tidak perlu membuat akun.",
    },
    {
        q: "Dari mana cuaca dan data bencananya?",
        a: "Prakiraan cuaca dari BMKG. Angka kejadian dan zona dari BNPB. Keduanya diberi keterangan sumber di halaman yang memakainya.",
    },
];
export function Faq() {
    const [open, setOpen] = useState(0);
    return (_jsx("section", { className: "px-4 py-6 md:px-8 md:py-8", children: _jsxs("div", { className: "grid gap-8 rounded-[28px] bg-white px-5 py-10 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-12", children: [_jsx("h2", { className: "text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-[#10243F] md:text-[36px]", children: "Pertanyaan yang biasanya ditanyakan dulu." }), _jsx("div", { className: "divide-y divide-[#E5DDD2] border-y border-[#E5DDD2]", children: FAQS.map((item, i) => {
                        const isOpen = open === i;
                        return (_jsxs("div", { children: [_jsxs("button", { type: "button", onClick: () => setOpen(isOpen ? -1 : i), "aria-expanded": isOpen, className: "flex w-full items-center justify-between gap-4 py-4 text-left", children: [_jsx("span", { className: "text-[16px] font-medium text-[#10243F]", children: item.q }), _jsx("span", { className: "text-[20px] leading-none text-[#5C6B7C]", "aria-hidden": "true", children: isOpen ? "–" : "+" })] }), isOpen && (_jsx("p", { className: "pb-4 text-[15px] leading-[1.6] text-[#3E5168]", children: item.a }))] }, item.q));
                    }) })] }) }));
}
