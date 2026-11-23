import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useShareCard } from "@/hooks/useShare";
import { TopoBackground } from "@/components/layout/TopoBackground";
const FALLBACK_TASKS = [
    {
        anggota: "Tugas Budi (Ayah)",
        tugas: "Mematikan listrik dan gas, lalu membawa dokumen penting keluarga.",
    },
    {
        anggota: "Tugas Sari (Ibu)",
        tugas: "Mendampingi Raka dan memastikan obat Nenek Aminah terbawa.",
    },
    {
        anggota: "Tugas untuk Nenek Aminah",
        tugas: "Dievakuasi lebih dulu dengan bantuan kursi roda, obat rutin dibawakan Sari.",
    },
];
export function Bagikan() {
    const { token } = useParams();
    const { data: card, isLoading } = useShareCard(token);
    if (isLoading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-white text-sm text-[#475569]", children: "Memuat rencana..." }));
    }
    const keluargaNama = card?.keluarga || "Keluarga Pratama";
    const titikUtama = card?.titik_kumpul?.[0]?.nama || "Aula Masjid Agung Dayeuhkolot";
    const tugasList = card?.rencana_evakuasi?.konten?.pembagian_tugas_keluarga?.length
        ? card.rencana_evakuasi.konten.pembagian_tugas_keluarga
        : FALLBACK_TASKS;
    return (_jsxs("div", { className: "relative mx-auto min-h-screen max-w-[390px] overflow-hidden bg-white px-5 py-6", children: [_jsx(TopoBackground, { variant: "light" }), _jsxs("div", { className: "relative z-10", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: "Rencana darurat (hanya baca)" }), _jsx("h1", { className: "mt-1 text-[28px] leading-tight font-bold text-[#0F172A]", children: keluargaNama }), _jsxs("div", { className: "mt-5 rounded-[20px] bg-[#F4F1EA] p-5", children: [_jsx("p", { className: "text-[20px] font-bold text-[#92400E]", children: "\u26A0 Waspada banjir" }), _jsx("p", { className: "mt-2 text-[17px] leading-[1.35] text-[#92400E]", children: card?.rencana_evakuasi?.konten?.ringkasan_risiko ??
                                    "Hujan lebat diperkirakan sore ini di Dayeuhkolot." })] }), _jsxs("div", { className: "mt-3.5 rounded-[20px] bg-[#F4F1EA] p-5", children: [_jsx("p", { className: "text-[12px] text-[#C2410C]", children: "Titik kumpul" }), _jsx("p", { className: "mt-1.5 text-[18px] leading-[1.25] font-bold text-[#0F172A]", children: titikUtama }), _jsx("p", { className: "mt-1 text-[16px] text-[#475569]", children: "400 meter dari rumah" })] }), _jsx("div", { className: "mt-3.5 space-y-2.5", children: tugasList.map((t, i) => {
                            const label = t.anggota?.startsWith("Tugas")
                                ? t.anggota
                                : `Tugas ${t.anggota}`;
                            return (_jsxs("div", { className: "rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3.5", children: [_jsx("p", { className: "text-[12px] text-[#475569]", children: label }), _jsx("p", { className: "mt-1 text-[16px] leading-[1.3] font-medium text-[#0F172A]", children: t.tugas ?? t.peran })] }, i));
                        }) }), _jsx("a", { href: "tel:112", className: "mt-5 flex h-[64px] w-full items-center justify-center rounded-full bg-[#DC2626] text-[20px] font-bold text-white", children: "\u260E Telepon 112" }), _jsx("button", { type: "button", onClick: () => window.print(), className: "mt-3.5 block w-full text-center text-[15px] font-semibold text-[#C2410C]", children: "Unduh sebagai PDF" }), _jsxs("div", { className: "mt-6 text-center text-[12px] text-[#475569]", children: [_jsx("p", { children: "Data cuaca BMKG & data bencana BNPB" }), _jsx("p", { className: "mt-1 font-medium", children: "Dibuat dengan SiagaKeluarga" })] })] })] }));
}
