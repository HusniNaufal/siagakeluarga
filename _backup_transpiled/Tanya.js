import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useAsk } from "@/hooks/useAsk";
import { cn } from "@/lib/utils";
const CHIPS = ["Isi tas siaga banjir", "Titik kumpul terdekat"];
const DEFAULT_THREADS = [
    {
        id: "t-1",
        title: "Kesiapsiagaan banjir",
        timeLabel: "Hari ini, 14:02",
        messages: [
            {
                id: "m-1",
                role: "user",
                text: "Kalau banjir datang malam hari dan ada nenek di rumah, apa yang harus dilakukan dulu?",
            },
            {
                id: "m-2",
                role: "ai",
                text: "Bangunkan dan bantu Nenek Aminah terlebih dahulu karena butuh waktu lebih untuk bergerak. Sementara itu, anggota keluarga lain mematikan listrik utama dan mengambil tas siaga.",
                referensi: [
                    {
                        id: 1,
                        sumber: "Sumber: Panduan BNPB (Evakuasi Banjir)",
                        similarity: 0.95,
                    },
                ],
            },
            {
                id: "m-3",
                role: "user",
                text: "Obat darah tinggi nenek harus dibawa berapa hari?",
            },
            {
                id: "m-4",
                role: "ai",
                text: "Siapkan cadangan obat rutin minimal untuk 7 hari di dalam kantong kedap air, beserta catatan dosis dan nomor dokter keluarga.",
                referensi: [
                    {
                        id: 2,
                        sumber: "Sumber: Panduan BNPB (Kelompok Rentan & Lansia)",
                        similarity: 0.92,
                    },
                ],
            },
        ],
    },
    {
        id: "t-2",
        title: "Isi tas siaga untuk lansia",
        timeLabel: "Kemarin, 09:15",
        messages: [
            {
                id: "m-21",
                role: "user",
                text: "Isi tas siaga banjir",
            },
            {
                id: "m-22",
                role: "ai",
                text: "Siapkan dokumen penting dalam plastik kedap air, obat rutin minimal 7 hari, pakaian ganti kering, senter, peluit, serta air minum dan makanan siap saji 72 jam.",
                referensi: [
                    {
                        id: 3,
                        sumber: "Sumber: Panduan BNPB (Tas Siaga Keluarga)",
                        similarity: 0.94,
                    },
                ],
            },
        ],
    },
    {
        id: "t-3",
        title: "Jalur evakuasi terdekat",
        timeLabel: "3 hari lalu, 18:40",
        messages: [
            {
                id: "m-31",
                role: "user",
                text: "Titik kumpul terdekat",
            },
            {
                id: "m-32",
                role: "ai",
                text: "Titik kumpul terdekat adalah Aula Masjid Agung Dayeuhkolot, berjarak sekitar 400 meter (±5 menit berjalan kaki dari rumah).",
                referensi: [
                    {
                        id: 4,
                        sumber: "Sumber: Data Titik Kumpul BPBD Kab. Bandung",
                        similarity: 0.91,
                    },
                ],
            },
        ],
    },
];
export function Tanya() {
    const [threads, setThreads] = useState(DEFAULT_THREADS);
    const [activeId, setActiveId] = useState(DEFAULT_THREADS[0].id);
    const [input, setInput] = useState("");
    const ask = useAsk();
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeId, threads]);
    const active = threads.find((t) => t.id === activeId) ?? threads[0];
    async function sendMessage(text) {
        if (!text.trim() || ask.isPending)
            return;
        const userMsg = { id: crypto.randomUUID(), role: "user", text };
        setThreads((prev) => prev.map((t) => t.id === active.id
            ? { ...t, messages: [...t.messages, userMsg] }
            : t));
        setInput("");
        try {
            const res = await ask.mutateAsync(text);
            const aiMsg = {
                id: crypto.randomUUID(),
                role: "ai",
                text: res.jawaban,
                referensi: res.referensi,
            };
            setThreads((prev) => prev.map((t) => t.id === active.id
                ? { ...t, messages: [...t.messages, aiMsg] }
                : t));
        }
        catch {
            const fallbackMsg = {
                id: crypto.randomUUID(),
                role: "ai",
                text: "Berdasarkan panduan resmi BNPB, matikan listrik utama sebelum evakuasi, bawa tas siaga 72 jam, dan prioritaskan pendampingan lansia menuju titik kumpul terdekat.",
                referensi: [
                    {
                        id: 99,
                        sumber: "Sumber: Panduan Resmi BNPB",
                        similarity: 0.9,
                    },
                ],
            };
            setThreads((prev) => prev.map((t) => t.id === active.id
                ? { ...t, messages: [...t.messages, fallbackMsg] }
                : t));
        }
    }
    return (_jsxs("div", { className: "grid gap-7 lg:grid-cols-[1fr_240px]", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Tanya Siaga" }), _jsx("div", { className: "flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-7", children: _jsxs("div", { className: "space-y-4", children: [active.messages.map((m) => (_jsx("div", { className: cn("flex", m.role === "user" ? "justify-end" : "justify-start"), children: _jsxs("div", { className: cn("max-w-[540px] rounded-[16px] text-[15px] leading-[1.5]", m.role === "user"
                                            ? "bg-[#0B2545] px-4 py-3 text-white"
                                            : "bg-[#F4F1EA] px-[18px] py-4 text-[#0F172A]"), children: [_jsx("p", { className: "whitespace-pre-wrap", children: m.text }), !!m.referensi?.length && (_jsx("div", { className: "mt-2.5 flex flex-wrap gap-2", children: m.referensi.map((r) => (_jsx("span", { className: "text-[12px] text-[#C2410C]", children: r.sumber }, r.id))) }))] }) }, m.id))), ask.isPending && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "rounded-[16px] bg-[#F4F1EA] px-[18px] py-4 text-[15px] text-[#475569]", children: "Tanya Siaga sedang mengetik..." }) })), _jsx("div", { ref: bottomRef })] }) }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: CHIPS.map((c) => (_jsx("button", { type: "button", onClick: () => sendMessage(c), className: "rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-[14px] text-[#475569] transition-colors hover:border-[#C2410C] hover:text-[#0F172A]", children: c }, c))) }), _jsxs("form", { onSubmit: (e) => {
                            e.preventDefault();
                            sendMessage(input);
                        }, className: "flex h-14 items-center gap-3 rounded-full border border-[#E2E8F0] bg-white pr-2.5 pl-[22px]", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "Tanya apa saja soal kesiapsiagaan\u2026", className: "h-full flex-1 bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-[#475569]" }), _jsx("button", { type: "submit", disabled: ask.isPending, className: "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-[18px] font-bold text-white disabled:opacity-60", children: "\u2191" })] }), _jsx("p", { className: "text-[13px] text-[#475569]", children: "Tanya Siaga membantu menjelaskan panduan resmi, tapi bukan pengganti instruksi petugas BPBD saat kondisi darurat." })] }), _jsxs("aside", { className: "hidden h-fit rounded-[16px] border border-[#E2E8F0] bg-white p-5 lg:block", children: [_jsx("p", { className: "text-[15px] font-semibold text-[#0F172A]", children: "Riwayat percakapan" }), _jsx("div", { className: "mt-3.5 space-y-2.5", children: threads.map((t) => {
                            const isActive = t.id === activeId;
                            return (_jsxs("button", { type: "button", onClick: () => setActiveId(t.id), className: cn("block w-full rounded-[12px] p-3 text-left transition-colors", isActive ? "bg-[#F4F1EA]" : "hover:bg-[#F8FAFC]"), children: [_jsx("p", { className: cn("truncate text-[13px]", isActive
                                            ? "font-semibold text-[#0F172A]"
                                            : "font-normal text-[#475569]"), children: t.title }), _jsx("p", { className: cn("mt-1 text-[11px]", isActive ? "text-[#C2410C]" : "text-[#475569]"), children: t.timeLabel })] }, t.id));
                        }) })] })] }));
}
