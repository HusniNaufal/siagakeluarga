import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Trash2 } from "lucide-react";
import { useAddMember, useUpdateHousehold } from "@/hooks/useHousehold";
import { useRegions } from "@/hooks/useRisk";
import { useGeneratePlan } from "@/hooks/usePlan";
import { TopoBackground } from "@/components/layout/TopoBackground";
const KONDISI_OPTIONS = [
    {
        value: "dekat-sungai",
        label: "Rumah dekat bantaran sungai",
    },
    {
        value: "satu-lantai",
        label: "Lantai 1 saja (tidak bertingkat)",
    },
    {
        value: "akses-tinggi",
        label: "Ada akses ke tempat lebih tinggi di dekat rumah",
    },
];
const AI_STEPS = [
    "Menilai risiko lokasi",
    "Menyusun tugas tiap anggota",
    "Menulis daftar tas siaga…",
    "Menyiapkan titik kumpul terdekat",
];
export function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [members, setMembers] = useState([
        {
            panggilan: "Budi, Ayah (42 thn)",
            kelompok_umur: "DEWASA",
            kebutuhan_khusus: "",
        },
        {
            panggilan: "Nenek Aminah (72 thn)",
            kelompok_umur: "LANSIA",
            kebutuhan_khusus: "Lansia, obat darah tinggi rutin",
        },
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPanggilan, setNewPanggilan] = useState("");
    const [newUmur, setNewUmur] = useState("DEWASA");
    const [newKebutuhan, setNewKebutuhan] = useState("");
    const [alamat, setAlamat] = useState("Jl. Raya Dayeuhkolot No. 12, RT 03/RW 05");
    const [regionId, setRegionId] = useState(null);
    const [selectedKondisi, setSelectedKondisi] = useState([
        "dekat-sungai",
        "akses-tinggi",
    ]);
    const [aiStepIndex, setAiStepIndex] = useState(2);
    const [aiError, setAiError] = useState(null);
    const { data: regions } = useRegions();
    const addMember = useAddMember();
    const updateHousehold = useUpdateHousehold();
    const generatePlan = useGeneratePlan();
    function handleAddDraftMember(e) {
        e.preventDefault();
        if (!newPanggilan.trim())
            return;
        setMembers((prev) => [
            ...prev,
            {
                panggilan: newPanggilan.trim(),
                kelompok_umur: newUmur,
                kebutuhan_khusus: newKebutuhan.trim(),
            },
        ]);
        setNewPanggilan("");
        setNewKebutuhan("");
        setNewUmur("DEWASA");
        setShowAddForm(false);
    }
    function toggleKondisi(val) {
        setSelectedKondisi((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);
    }
    async function finish() {
        setStep(4);
        setAiError(null);
        try {
            setAiStepIndex(1);
            for (const m of members.filter((m) => m.panggilan.trim())) {
                await addMember.mutateAsync({
                    panggilan: m.panggilan.trim(),
                    kelompok_umur: m.kelompok_umur,
                    kebutuhan_khusus: m.kebutuhan_khusus.trim() || null,
                });
            }
            setAiStepIndex(2);
            await updateHousehold.mutateAsync({
                region_id: regionId ?? regions?.[0]?.id ?? null,
                lat: -6.9889,
                lng: 107.6269,
            });
            setAiStepIndex(3);
            await generatePlan.mutateAsync();
            navigate("/beranda-saya", { replace: true });
        }
        catch {
            setAiError("Gagal menyusun rencana otomatis. Kamu tetap bisa mencoba lagi dari halaman Rencana Darurat.");
        }
    }
    return (_jsxs("div", { className: "relative flex min-h-screen flex-col overflow-hidden bg-[#F4F1EA]", children: [_jsx(TopoBackground, { variant: "warm" }), _jsxs("header", { className: "relative z-10 flex h-[72px] w-full items-center justify-between border-b border-[#E2E8F0] bg-white px-6 md:px-12", children: [_jsx(Link, { to: "/", className: "text-[18px] font-semibold text-[#0B2545]", children: "\u2190 Kembali ke SiagaKeluarga" }), _jsx("p", { className: "text-[13px] font-medium text-[#475569]", children: step <= 3
                            ? `Pengaturan Rencana Keluarga (Langkah ${step} dari 3)`
                            : "Menyusun Rencana Darurat Keluarga" })] }), _jsx("main", { className: "relative z-10 mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-10", children: _jsxs("div", { className: `w-full rounded-[28px] border border-[#E2E8F0] bg-white p-8 md:p-12 ${step === 4 ? "max-w-[560px]" : "max-w-[760px]"}`, children: [step <= 3 && (_jsx("div", { className: "mb-8 flex items-center", children: [1, 2, 3].map((s, idx) => {
                                const done = s < step;
                                const active = s === step;
                                return (_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: `flex size-8 items-center justify-center rounded-full text-[13px] ${done || active
                                                ? "bg-[#C2410C] text-white"
                                                : "border border-[#E2E8F0] bg-[#F4F1EA] text-[#475569]"}`, children: done ? "✓" : s }), idx < 2 && (_jsx("span", { className: `h-[2px] w-[72px] ${done ? "bg-[#C2410C]" : "bg-[#CBD5E1]"}` }))] }, s));
                            }) })), step === 1 && (_jsxs("div", { className: "space-y-8", children: [_jsx("h1", { className: "text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]", children: "Siapa saja yang tinggal di rumahmu?" }), _jsxs("div", { className: "space-y-3", children: [members.map((m, i) => (_jsxs("div", { className: "flex items-center justify-between gap-4 rounded-[16px] bg-[#F4F1EA] p-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [i === 0 ? (_jsx("img", { src: "/images/avatar-budi.webp", alt: m.panggilan, className: "size-[44px] shrink-0 rounded-full object-cover" })) : (_jsx("span", { className: "flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-xs font-semibold text-white", children: "NA" })), _jsxs("div", { children: [_jsx("p", { className: "text-[16px] font-semibold text-[#0F172A]", children: m.panggilan }), _jsx("p", { className: `mt-0.5 text-[14px] ${m.kebutuhan_khusus
                                                                        ? "text-[#9A3412]"
                                                                        : "text-[#475569]"}`, children: m.kebutuhan_khusus || "Tidak ada kebutuhan khusus" })] })] }), members.length > 1 && (_jsx("button", { type: "button", onClick: () => setMembers((prev) => prev.filter((_, idx) => idx !== i)), className: "text-[#475569] hover:text-[#DC2626]", children: _jsx(Trash2, { className: "size-4" }) }))] }, i))), showAddForm ? (_jsxs("form", { onSubmit: handleAddDraftMember, className: "space-y-3 rounded-[16px] border border-[#E2E8F0] bg-[#F4F1EA] p-4", children: [_jsx("input", { value: newPanggilan, onChange: (e) => setNewPanggilan(e.target.value), placeholder: "Nama panggilan & usia (mis. Sari, Ibu (39 thn))", required: true, className: "h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none focus-visible:border-[#C2410C]" }), _jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [_jsxs("select", { value: newUmur, onChange: (e) => setNewUmur(e.target.value), className: "h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none", children: [_jsx("option", { value: "DEWASA", children: "Dewasa" }), _jsx("option", { value: "LANSIA", children: "Lansia" }), _jsx("option", { value: "ANAK", children: "Anak" }), _jsx("option", { value: "BALITA", children: "Balita" })] }), _jsx("input", { value: newKebutuhan, onChange: (e) => setNewKebutuhan(e.target.value), placeholder: "Kebutuhan khusus (opsional)", className: "h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm outline-none" })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "rounded-full px-4 py-1.5 text-xs text-[#475569]", children: "Batal" }), _jsx("button", { type: "submit", className: "rounded-full bg-[#C2410C] px-4 py-1.5 text-xs font-semibold text-white", children: "Simpan" })] })] })) : (_jsx("button", { type: "button", onClick: () => setShowAddForm(true), className: "flex h-[56px] w-full items-center justify-center rounded-[16px] border border-[#E2E8F0] text-[15px] font-medium text-[#475569] hover:bg-[#F8FAFC]", children: "+ Tambah anggota" }))] }), _jsx("div", { className: "rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]", children: "Data anggota dipakai untuk membagi tugas evakuasi sesuai usia dan kebutuhan khusus (lansia/anak)." })] })), step === 2 && (_jsxs("div", { className: "space-y-8", children: [_jsx("h1", { className: "text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]", children: "Di mana alamat rumahmu?" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-[14px] font-medium text-[#0F172A]", children: "Alamat lengkap" }), _jsx("textarea", { value: alamat, onChange: (e) => setAlamat(e.target.value), rows: 2, className: "h-[80px] w-full resize-none rounded-[12px] border border-[#E2E8F0] bg-white p-[18px] text-[15px] text-[#0F172A] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("label", { className: "block text-[14px] font-medium text-[#0F172A]", children: "Kelurahan" }), _jsxs("select", { value: regionId ?? "", onChange: (e) => setRegionId(e.target.value ? Number(e.target.value) : null), className: "h-[52px] w-full rounded-[12px] border border-[#E2E8F0] bg-white px-[18px] text-[15px] text-[#0F172A] outline-none focus-visible:border-[#C2410C]", children: [_jsx("option", { value: "", children: "Dayeuhkolot, Kab. Bandung" }), regions?.map((r) => (_jsxs("option", { value: r.id, children: [r.kecamatan, ", ", r.kab_kota] }, r.id)))] }), _jsx("p", { className: "text-[13px] text-[#475569]", children: "Dipakai untuk menghitung risiko bencana lokasimu" })] })] }), _jsx("div", { className: "rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]", children: "Kelurahan digunakan untuk memetakan titik kumpul terdekat & prakiraan cuaca BMKG otomatis." })] })), step === 3 && (_jsxs("div", { className: "space-y-8", children: [_jsx("h1", { className: "text-[30px] leading-tight font-semibold tracking-[-0.02em] text-[#0F172A]", children: "Bagaimana kondisi rumahmu?" }), _jsx("div", { className: "space-y-3", children: KONDISI_OPTIONS.map((o) => {
                                        const checked = selectedKondisi.includes(o.value);
                                        return (_jsxs("button", { type: "button", onClick: () => toggleKondisi(o.value), className: "flex h-[56px] w-full items-center gap-3 rounded-[14px] bg-[#F4F1EA] px-4 text-left", children: [_jsx("span", { className: `flex size-[22px] shrink-0 items-center justify-center rounded-[6px] ${checked
                                                        ? "bg-[#C2410C] text-white"
                                                        : "border-[1.5px] border-[#E2E8F0] bg-white"}`, children: checked && _jsx(Check, { className: "size-3.5 stroke-[3]" }) }), _jsx("span", { className: "text-[16px] font-normal text-[#0F172A]", children: o.label })] }, o.value));
                                    }) }), _jsx("div", { className: "rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-[12px] text-[#475569]", children: "Kondisi rumah menentukan langkah penyelamatan awal (MCB listrik, lantai atas, & jalur keluar)." })] })), step === 4 && (_jsxs("div", { className: "flex flex-col items-center gap-7 text-center", children: [_jsx("div", { className: "size-[96px] animate-spin rounded-full border-8 border-[#E2E8F0] border-t-[#C2410C]" }), _jsx("h1", { className: "text-[24px] font-semibold text-[#0F172A]", children: "AI sedang menyusun rencanamu" }), _jsx("div", { className: "w-full space-y-4 text-left", children: AI_STEPS.map((s, i) => {
                                        const done = i < aiStepIndex;
                                        const active = i === aiStepIndex;
                                        return (_jsxs("div", { className: "flex items-center gap-3 text-[15px]", children: [done ? (_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C2410C] text-xs text-white", children: "\u2713" })) : active ? (_jsx("span", { className: "size-5 shrink-0 animate-spin rounded-full border-2 border-[#E2E8F0] border-t-[#C2410C]" })) : (_jsx("span", { className: "size-5 shrink-0 rounded-full border border-[#CBD5E1]" })), _jsx("span", { className: done || active
                                                        ? "font-medium text-[#0F172A]"
                                                        : "text-[#64748B]", children: s })] }, s));
                                    }) }), aiError && (_jsxs("div", { className: "w-full space-y-3 text-center", children: [_jsx("p", { className: "text-sm text-[#DC2626]", children: aiError }), _jsx("button", { type: "button", onClick: () => navigate("/beranda-saya", { replace: true }), className: "rounded-full bg-[#C2410C] px-6 py-2.5 text-xs font-semibold text-white", children: "Lanjut ke Beranda Saya" })] }))] })), step <= 3 && (_jsxs("div", { className: "mt-8 flex items-center justify-between", children: [_jsx("button", { type: "button", onClick: () => step < 3
                                        ? setStep((s) => s + 1)
                                        : navigate("/beranda-saya", { replace: true }), className: "text-[15px] font-normal text-[#475569] hover:text-[#0F172A]", children: "Lewati dulu" }), step < 3 ? (_jsx("button", { type: "button", onClick: () => setStep((s) => s + 1), className: "inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-semibold text-white", children: "Lanjut" })) : (_jsx("button", { type: "button", onClick: finish, className: "inline-flex h-[52px] items-center justify-center rounded-full bg-[#C2410C] px-7 text-[16px] font-semibold text-white", children: "Selesai, susun rencanaku" }))] }))] }) })] }));
}
