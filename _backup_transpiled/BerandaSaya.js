import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHousehold } from "@/hooks/useHousehold";
import { useDrills } from "@/hooks/useDrills";
import { useRisk } from "@/hooks/useRisk";
import { ProgressRing } from "@/components/ProgressRing";
import { computeSkorKesiapan } from "@/lib/score";
const DEFAULT_TIMELINE = [
    { jam: "08:00", suhu: "27°", ket: "Cerah (0% hujan)", active: false, blueKet: false },
    { jam: "11:00", suhu: "29°", ket: "Berawan (10% hujan)", active: false, blueKet: false },
    { jam: "14:00", suhu: "24°", ket: "Hujan lebat (80%)", active: true, blueKet: false },
    { jam: "17:00", suhu: "22°", ket: "Hujan ringan (60%)", active: false, blueKet: true },
    { jam: "20:00", suhu: "21°", ket: "Berawan (20% hujan)", active: false, blueKet: false },
];
export function BerandaSaya() {
    const { user } = useAuth();
    const { data: household, isLoading } = useHousehold();
    const { data: drillsData } = useDrills();
    const { data: risk } = useRisk(household?.region_id
        ? {
            region_id: household.region_id,
            lat: household.lat ?? undefined,
            lng: household.lng ?? undefined,
        }
        : undefined);
    const [showMapModal, setShowMapModal] = useState(false);
    if (isLoading || !household) {
        return _jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted" });
    }
    const adaRencana = (household.emergency_plans?.length ?? 0) > 0;
    const skor = computeSkorKesiapan({
        adaRencana,
        persentaseTasSiaga: household.kesiapan_tas.persentase || 67,
        rataRataSkorLatihan: drillsData?.rata_rata_skor ?? null,
    });
    const siapCount = household.kesiapan_tas.total > 0 ? household.kesiapan_tas.siap : 8;
    const totalCount = household.kesiapan_tas.total > 0 ? household.kesiapan_tas.total : 12;
    const belumCount = Math.max(0, totalCount - siapCount);
    const pctTas = Math.round((siapCount / Math.max(1, totalCount)) * 100);
    const titikTerdekat = risk?.titik_kumpul?.[0] ?? {
        id: 1,
        nama: "Aula Masjid Agung Dayeuhkolot",
        jarak_km: 0.4,
        lat: -6.9882,
        lng: 107.6284,
    };
    const cuaca = risk?.cuaca;
    const namaDepan = (user?.nama ?? "Budi").split(" ")[0];
    const kecamatanLabel = cuaca && cuaca.tersedia && cuaca.lokasi?.kecamatan
        ? cuaca.lokasi.kecamatan
        : household.region?.kecamatan ?? "Dayeuhkolot";
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: ["Halo, ", namaDepan] }), _jsx("p", { className: "mt-1 text-[15px] text-[#475569]", children: "Sabtu, 21 November 2026" })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [_jsxs("div", { className: "rounded-[8px] border border-[#E2E8F0] bg-white px-3.5 py-2 text-[12px] text-[#475569]", children: ["Kel. ", kecamatanLabel, ", sinkron 14:00 WIB"] }), _jsx(Link, { to: "/rencana", className: "rounded-[8px] bg-[#0B2545] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#13345D]", children: "Perbarui rencana" })] })] }), _jsxs("div", { className: "relative rounded-[20px] bg-[#0B2545] px-7 pt-14 pb-6 text-white", children: [_jsx("div", { className: "absolute top-4 left-7 inline-flex items-center rounded-full bg-[#D97706] px-3.5 py-1.5 text-[13px] font-medium text-white", children: "\u26A0 Waspada" }), _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("p", { className: "text-[12px] text-white/65", children: ["Prakiraan BMKG ", kecamatanLabel] }), _jsx("h2", { className: "text-[20px] font-semibold text-[#F5F5F4] md:text-[22px]", children: cuaca?.tersedia
                                            ? `${cuaca.saat_ini.cuaca} diperkirakan hari ini`
                                            : "Hujan lebat diperkirakan 15:00 hari ini" })] }), _jsx("p", { className: "text-[40px] font-normal text-[#F5F5F4]", children: cuaca?.tersedia ? `${Math.round(cuaca.saat_ini.suhu_c)}°` : "24°" })] })] }), _jsxs("div", { className: "grid gap-5 md:grid-cols-3", children: [_jsxs("div", { className: "flex flex-col items-center justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6 text-center", children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Skor kesiapan" }), _jsx("div", { className: "my-3", children: _jsx(ProgressRing, { value: skor || 72, size: 116 }) }), _jsx("p", { className: "text-[13px] text-[#475569]", children: "Terus lengkapi rencanamu" })] }), _jsxs("div", { className: "flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Tas siaga" }), _jsxs("div", { className: "my-3", children: [_jsxs("p", { className: "text-[36px] leading-none font-normal text-[#0F172A]", children: [siapCount, "/", totalCount] }), _jsx("div", { className: "mt-4 h-2.5 w-full overflow-hidden rounded-[5px] bg-[#E2E8F0]", children: _jsx("div", { className: "h-full rounded-[5px] bg-[#C2410C]", style: { width: `${pctTas}%` } }) })] }), _jsxs("p", { className: "text-[13px] text-[#475569]", children: [belumCount, " barang perlu dicek"] })] }), _jsxs("div", { className: "flex flex-col justify-between rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Langkah berikutnya" }), _jsx("p", { className: "mt-2.5 text-[18px] leading-[1.3] font-semibold text-[#9A3412]", children: "Tambahkan kontak darurat keluarga besar" }), _jsx("p", { className: "mt-1.5 text-[12px] text-[#475569]", children: "Menambah +14% skor kesiapan keluarga (estimasi 2 menit)" })] }), _jsx(Link, { to: "/keluarga", className: "mt-4 flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#C2410C] text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "Lanjutkan" })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white px-7 py-5", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Titik kumpul terdekat" }), _jsxs("p", { className: "mt-1 text-[17px] font-semibold text-[#0F172A]", children: [titikTerdekat.nama, " (400 m)"] })] }), _jsx("button", { type: "button", onClick: () => setShowMapModal(true), className: "rounded-[8px] border border-[#E2E8F0] bg-white px-4 py-2 text-[14px] font-semibold text-[#0F172A] hover:bg-[#F4F1EA]", children: "Lihat peta" })] }), _jsx("div", { className: "grid grid-cols-2 gap-3 rounded-[16px] border border-[#E2E8F0] bg-white p-4 sm:grid-cols-5", children: DEFAULT_TIMELINE.map((item) => (_jsxs("div", { className: `flex flex-col items-center gap-1 rounded-[12px] px-3 py-3.5 text-center ${item.active
                        ? "border-[1.5px] border-[#C2410C] bg-[#FFF7ED]"
                        : "border border-[#E2E8F0] bg-[#F8FAFC]"}`, children: [_jsx("p", { className: `text-[12px] ${item.active ? "text-[#C2410C]" : "text-[#475569]"}`, children: item.jam }), _jsx("p", { className: `text-[18px] ${item.active ? "text-[#C2410C]" : "text-[#0B2545]"}`, children: item.suhu }), _jsx("p", { className: `text-[12px] ${item.active
                                ? "font-semibold text-[#9A3412]"
                                : item.blueKet
                                    ? "font-medium text-[#1D4ED8]"
                                    : "font-medium text-[#475569]"}`, children: item.ket })] }, item.jam))) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-6", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("img", { src: "/images/avatar-budi.webp", alt: "Budi", className: "size-9 rounded-full object-cover" }), _jsx("span", { className: "text-[13px] font-medium text-[#0F172A]", children: "Budi" })] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]", children: "SP" }), _jsx("span", { className: "text-[13px] font-medium text-[#0F172A]", children: "Sari" })] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]", children: "NA" }), _jsx("span", { className: "text-[13px] font-medium text-[#0F172A]", children: "Nenek Aminah" })] }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: "flex size-9 items-center justify-center rounded-full bg-[#F4F1EA] text-[11px] text-[#0B2545]", children: "RP" }), _jsx("span", { className: "text-[13px] font-medium text-[#0F172A]", children: "Raka" })] })] }), _jsx(Link, { to: "/keluarga", className: "text-[13px] font-semibold text-[#C2410C] hover:underline", children: "Lihat profil keluarga" })] }), showMapModal && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#0B2545]/45 p-4", children: _jsxs("div", { className: "flex w-full max-w-[620px] flex-col gap-4 rounded-[18px] border border-[#E2E8F0] bg-white px-8 py-7 shadow-[0_20px_48px_rgba(11,37,69,0.16)]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[20px] font-semibold text-[#0B2545]", children: "Rute ke Titik Kumpul Terdekat" }), _jsx("button", { type: "button", onClick: () => setShowMapModal(false), className: "text-[20px] leading-none font-medium text-[#64748B] hover:text-[#0F172A]", children: "\u00D7" })] }), _jsxs("div", { className: "relative h-[240px] w-full overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-[#E2E8F0]", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "Peta OSM Dayeuhkolot", className: "h-full w-full object-cover" }), _jsx("div", { className: "absolute top-1/2 left-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C2410C] text-white shadow", children: _jsx("span", { className: "size-2.5 rounded-full bg-white" }) })] }), _jsxs("div", { className: "space-y-1.5 py-1", children: [_jsx("p", { className: "text-[16px] font-semibold text-[#0B2545]", children: titikTerdekat.nama }), _jsx("p", { className: "text-[13px] leading-[20px] text-[#475569]", children: "Jarak 400 meter (\u00B15 menit berjalan kaki dari Jl. Raya Dayeuhkolot No. 12). Kapasitas 450 orang, akses ramah kursi roda untuk Nenek Aminah." })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("p", { className: "text-[12px] font-medium text-[#64748B]", children: "Sumber koordinat: BPBD Kab. Bandung" }), _jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("button", { type: "button", onClick: () => setShowMapModal(false), className: "h-[42px] rounded-[8px] border border-[#CBD5E1] bg-white px-[18px] text-[13px] font-semibold text-[#0B2545]", children: "Tutup" }), _jsx("a", { href: `https://www.google.com/maps/search/?api=1&query=${titikTerdekat.lat},${titikTerdekat.lng}`, target: "_blank", rel: "noreferrer", className: "flex h-[42px] items-center rounded-[8px] bg-[#C2410C] px-5 text-[13px] font-semibold text-white", children: "Buka di Google Maps \u2192" })] })] })] }) }))] }));
}
