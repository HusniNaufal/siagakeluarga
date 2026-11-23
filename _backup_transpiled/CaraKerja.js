import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STEPS = [
    {
        n: "01",
        title: "Isi siapa yang ada di rumah",
        text: "Nama, usia, dan kebutuhan khusus. Obat rutin dan anak kecil mengubah isi tas maupun tugas.",
    },
    {
        n: "02",
        title: "Rencana disusun dari lokasi itu",
        text: "Titik kumpul terdekat, tugas masing-masing, dan catatan untuk anggota yang butuh bantuan jalan.",
    },
    {
        n: "03",
        title: "Bagikan, lalu coba sekali",
        text: "Kirim tautan baca-saja ke keluarga. Yang membuka tidak perlu mendaftar. Latihan singkat mengecek apakah jalurnya masuk akal.",
    },
];
export function CaraKerja() {
    return (_jsx("section", { id: "cara-kerja", className: "px-4 py-6 md:px-8 md:py-8", children: _jsxs("div", { className: "rounded-[28px] bg-white px-5 py-10 md:px-10 md:py-14", children: [_jsxs("div", { className: "max-w-[640px]", children: [_jsx("h2", { className: "text-[32px] leading-[1.15] font-semibold tracking-[-0.03em] text-[#10243F] md:text-[40px]", children: "Tiga langkah, sekitar sepuluh menit." }), _jsx("p", { className: "mt-3 text-[16px] leading-[1.6] text-[#3E5168]", children: "Kamu bisa berhenti di tengah dan melanjutkan nanti. Yang sudah diisi tidak hilang." })] }), _jsx("ol", { className: "mt-10 grid gap-8 lg:grid-cols-3", children: STEPS.map((step) => (_jsxs("li", { children: [_jsx("p", { className: "text-[13px] font-medium text-[#9A3412]", children: step.n }), _jsx("h3", { className: "mt-2 text-[20px] leading-snug font-semibold text-[#10243F]", children: step.title }), _jsx("p", { className: "mt-2 text-[15px] leading-[1.55] text-[#3E5168]", children: step.text })] }, step.n))) }), _jsxs("div", { className: "mt-10 grid gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "rounded-2xl bg-[#F6F3EC] p-5", children: [_jsx("p", { className: "text-[14px] font-semibold text-[#10243F]", children: "Keluarga Pratama" }), _jsxs("ul", { className: "mt-4 space-y-3 text-[15px] text-[#142033]", children: [_jsxs("li", { className: "flex items-center gap-3", children: [_jsx("span", { className: "size-8 rounded-full bg-[#10243F]", "aria-hidden": "true" }), "Budi, ayah, 42 tahun"] }), _jsxs("li", { className: "flex items-center gap-3", children: [_jsx("span", { className: "size-8 rounded-full bg-[#C4A484]", "aria-hidden": "true" }), "Sari, ibu, 39 tahun"] }), _jsxs("li", { className: "flex items-center gap-3", children: [_jsx("span", { className: "size-8 rounded-full bg-[#9A3412]", "aria-hidden": "true" }), "Nenek Aminah, 72, obat rutin"] }), _jsx("li", { className: "rounded-xl bg-white px-3 py-2 text-[14px] text-[#3E5168]", children: "Kel. Dayeuhkolot, Kab. Bandung" })] })] }), _jsxs("div", { className: "rounded-2xl bg-[#F6F3EC] p-5", children: [_jsx("p", { className: "text-[14px] font-semibold text-[#10243F]", children: "Yang sedang disusun" }), _jsx("ul", { className: "mt-4 space-y-3 text-[15px]", children: ["Risiko lokasi dicek", "Tugas tiap anggota ditulis", "Daftar tas masih dilengkapi"].map((row, i) => (_jsxs("li", { className: "flex items-start gap-2.5 text-[#142033]", children: [_jsx("span", { className: i < 2
                                                    ? "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-[#157347] text-[12px] text-white"
                                                    : "mt-0.5 size-5 shrink-0 rounded-md border border-[#10243F]/30", "aria-hidden": "true", children: i < 2 ? "✓" : "" }), row] }, row))) }), _jsxs("div", { className: "mt-4 rounded-xl bg-white px-3 py-3", children: [_jsx("p", { className: "text-[13px] text-[#5C6B7C]", children: "Titik kumpul usulan" }), _jsx("p", { className: "mt-1 text-[15px] font-semibold text-[#10243F]", children: "Aula Masjid Agung Dayeuhkolot, 400 m" })] })] }), _jsxs("div", { className: "rounded-2xl bg-[#F6F3EC] p-5", children: [_jsx("p", { className: "text-[14px] font-semibold text-[#10243F]", children: "Dibagikan ke keluarga" }), _jsxs("div", { className: "mt-4 rounded-xl bg-white px-3 py-3", children: [_jsx("p", { className: "text-[13px] text-[#5C6B7C]", children: "Tautan baca-saja" }), _jsx("p", { className: "mt-1 text-[15px] font-semibold break-all text-[#10243F]", children: "siagakeluarga.id/r/contoh" })] }), _jsx("p", { className: "mt-4 text-[14px] leading-[1.5] text-[#3E5168]", children: "Nenek Aminah membuka tautan ini di ponsel. Tombol telepon ke kontak darurat cukup besar untuk ditekan." })] })] })] }) }));
}
