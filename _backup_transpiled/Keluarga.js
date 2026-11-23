import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAddMember, useDeleteMember, useHousehold, } from "@/hooks/useHousehold";
const UMUR_LABEL = {
    BALITA: "Balita",
    ANAK: "Anak",
    DEWASA: "Dewasa",
    LANSIA: "Lansia",
};
const DEFAULT_MEMBERS = [
    {
        id: "m-1",
        nama: "Budi, Ayah (42 thn)",
        sub: "Tidak ada kebutuhan khusus",
        avatar: "/images/avatar-budi.webp",
        initials: "BP",
        tags: [],
    },
    {
        id: "m-2",
        nama: "Sari, Ibu (39 thn)",
        sub: "",
        avatar: null,
        initials: "SP",
        tags: ["Ibu hamil"],
    },
    {
        id: "m-3",
        nama: "Nenek Aminah (72 thn)",
        sub: "",
        avatar: null,
        initials: "NA",
        tags: ["Lansia", "Obat darah tinggi rutin"],
    },
    {
        id: "m-4",
        nama: "Raka (6 thn)",
        sub: "Balita, perlu pendampingan saat evakuasi",
        avatar: null,
        initials: "RP",
        tags: [],
    },
];
const DEFAULT_CONTACTS = [
    { id: "c-1", nama: "Pak RT Dayeuhkolot", nomor: "(022) 512-7788" },
    { id: "c-2", nama: "Puskesmas Dayeuhkolot", nomor: "(022) 589-1122" },
];
function getInitials(name) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("");
}
export function Keluarga() {
    const { data: household, isLoading } = useHousehold();
    const addMember = useAddMember();
    const deleteMember = useDeleteMember();
    const [showAddMember, setShowAddMember] = useState(false);
    const [panggilan, setPanggilan] = useState("");
    const [kelompokUmur, setKelompokUmur] = useState("DEWASA");
    const [kebutuhan, setKebutuhan] = useState("");
    const [contacts, setContacts] = useState(DEFAULT_CONTACTS);
    const [showAddContact, setShowAddContact] = useState(false);
    const [contactNama, setContactNama] = useState("");
    const [contactNomor, setContactNomor] = useState("");
    if (isLoading || !household) {
        return _jsx("div", { className: "h-40 animate-pulse rounded-2xl bg-muted" });
    }
    async function onAddMember(e) {
        e.preventDefault();
        if (!panggilan.trim())
            return;
        await addMember.mutateAsync({
            panggilan: panggilan.trim(),
            kelompok_umur: kelompokUmur,
            kebutuhan_khusus: kebutuhan.trim() || null,
        });
        setPanggilan("");
        setKebutuhan("");
        setKelompokUmur("DEWASA");
        setShowAddMember(false);
    }
    function onAddContact(e) {
        e.preventDefault();
        if (!contactNama.trim() || !contactNomor.trim())
            return;
        setContacts((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                nama: contactNama.trim(),
                nomor: contactNomor.trim(),
            },
        ]);
        setContactNama("");
        setContactNomor("");
        setShowAddContact(false);
    }
    const hasBackendMembers = (household.members?.length ?? 0) > 0;
    return (_jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_360px]", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-[36px] leading-tight font-bold tracking-[-0.02em] text-[#0F172A]", children: "Profil keluarga" }), _jsx("button", { type: "button", onClick: () => setShowAddMember(true), className: "h-[44px] rounded-[12px] bg-[#C2410C] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#9A3412]", children: "+ Tambah anggota" })] }), hasBackendMembers
                        ? household.members.map((m, idx) => (_jsxs("div", { className: "flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [idx === 0 ? (_jsx("img", { src: "/images/avatar-budi.webp", alt: m.panggilan, className: "size-16 shrink-0 rounded-full object-cover" })) : (_jsx("div", { className: "flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[20px] text-[#0B2545]", children: getInitials(m.panggilan) })), _jsxs("div", { children: [_jsxs("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: [m.panggilan, " (", UMUR_LABEL[m.kelompok_umur], ")"] }), m.kebutuhan_khusus ? (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: m.kebutuhan_khusus.split(",").map((tag) => (_jsx("span", { className: "rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[13px] font-medium text-[#C2410C]", children: tag.trim() }, tag))) })) : (_jsx("p", { className: "mt-1 text-[14px] text-[#475569]", children: "Tidak ada kebutuhan khusus" }))] })] }), _jsx("button", { type: "button", onClick: () => deleteMember.mutate(m.id), className: "text-[14px] font-semibold text-[#C2410C] hover:underline", children: "Ubah" })] }, m.id)))
                        : DEFAULT_MEMBERS.map((m) => (_jsxs("div", { className: "flex items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [m.avatar ? (_jsx("img", { src: m.avatar, alt: m.nama, className: "size-16 shrink-0 rounded-full object-cover" })) : (_jsx("div", { className: "flex size-16 shrink-0 items-center justify-center rounded-full bg-[#F4F1EA] text-[20px] text-[#0B2545]", children: m.initials })), _jsxs("div", { children: [_jsx("p", { className: "text-[18px] font-semibold text-[#0F172A]", children: m.nama }), m.tags.length > 0 ? (_jsx("div", { className: "mt-2 flex flex-wrap gap-2", children: m.tags.map((t) => (_jsx("span", { className: "rounded-[6px] bg-[#F4F1EA] px-2.5 py-1 text-[13px] font-medium text-[#C2410C]", children: t }, t))) })) : (_jsx("p", { className: "mt-1 text-[14px] text-[#475569]", children: m.sub }))] })] }), _jsx("button", { type: "button", onClick: () => setShowAddMember(true), className: "text-[14px] font-semibold text-[#C2410C] hover:underline", children: "Ubah" })] }, m.id)))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Lokasi rumah" }), _jsxs("div", { className: "relative mt-3 h-[220px] w-full overflow-hidden rounded-[16px]", children: [_jsx("img", { src: "/images/map-dayeuhkolot.webp", alt: "Lokasi rumah Dayeuhkolot", className: "h-full w-full object-cover" }), _jsx("div", { className: "absolute top-[100px] left-[146px] size-5 rounded-full bg-[#C2410C]" })] }), _jsx("p", { className: "mt-4 text-[17px] font-semibold text-[#0F172A]", children: "Jl. Raya Dayeuhkolot No. 12" }), _jsx("p", { className: "mt-1 text-[15px] text-[#475569]", children: "Kel. Dayeuhkolot, Kab. Bandung" }), _jsx("p", { className: "mt-2.5 text-[13px] font-semibold text-[#9A3412]", children: "Zona waspada banjir (400 m dari Sungai Citarum)" })] }), _jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Kontak darurat keluarga besar" }), _jsxs("div", { className: "mt-3 space-y-2.5", children: [contacts.map((c) => (_jsxs("div", { className: "flex items-center justify-between rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5", children: [_jsx("span", { className: "text-[14px] font-semibold text-[#0F172A]", children: c.nama }), _jsx("span", { className: "text-[13px] text-[#475569]", children: c.nomor })] }, c.id))), _jsx("button", { type: "button", onClick: () => setShowAddContact(true), className: "w-full rounded-[10px] border border-[#CBD5E1] bg-white py-2.5 text-center text-[13px] font-semibold text-[#C2410C] hover:bg-[#F4F1EA]/40", children: "+ Tambah kontak darurat" })] })] }), _jsxs("div", { className: "rounded-[20px] border border-[#E2E8F0] bg-white p-6", children: [_jsx("p", { className: "text-[13px] text-[#475569]", children: "Ringkasan profil" }), _jsxs("div", { className: "mt-3 space-y-3 text-[14px]", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#475569]", children: "Anggota terdaftar" }), _jsx("span", { className: "font-semibold text-[#0F172A]", children: hasBackendMembers
                                                    ? `${household.members.length} orang`
                                                    : "4 orang" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#475569]", children: "Kebutuhan khusus" }), _jsx("span", { className: "font-semibold text-[#C2410C]", children: "3 kondisi" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-[#475569]", children: "Status profil" }), _jsx("span", { className: "font-semibold text-[#0F766E]", children: "Lengkap" })] })] })] })] }), showAddMember && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[480px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah anggota keluarga" }), _jsx("button", { type: "button", onClick: () => setShowAddMember(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAddMember, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Nama panggilan" }), _jsx("input", { value: panggilan, onChange: (e) => setPanggilan(e.target.value), placeholder: "Mis. Raka", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Kelompok umur" }), _jsx("select", { value: kelompokUmur, onChange: (e) => setKelompokUmur(e.target.value), className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] bg-white px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]", children: Object.entries(UMUR_LABEL).map(([v, l]) => (_jsx("option", { value: v, children: l }, v))) })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Kebutuhan khusus (opsional)" }), _jsx("input", { value: kebutuhan, onChange: (e) => setKebutuhan(e.target.value), placeholder: "Mis. Lansia, obat darah tinggi rutin", className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddMember(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan anggota" })] })] })] }) })), showAddContact && (_jsx("div", { role: "dialog", "aria-modal": "true", className: "fixed inset-0 z-50 flex items-center justify-center bg-[#07090C]/55 p-4", children: _jsxs("div", { className: "w-full max-w-[460px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-[22px] font-bold text-[#0F172A]", children: "Tambah kontak darurat" }), _jsx("button", { type: "button", onClick: () => setShowAddContact(false), className: "flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]", children: "\u00D7" })] }), _jsxs("form", { onSubmit: onAddContact, className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Nama kontak / instansi" }), _jsx("input", { value: contactNama, onChange: (e) => setContactNama(e.target.value), placeholder: "Mis. Pak RT Dayeuhkolot", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-[13px] font-medium text-[#475569]", children: "Nomor telepon" }), _jsx("input", { value: contactNomor, onChange: (e) => setContactNomor(e.target.value), placeholder: "Mis. (022) 512-7788", required: true, className: "h-11 w-full rounded-[12px] border border-[#CBD5E1] px-3.5 text-[14px] outline-none focus-visible:border-[#C2410C]" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { type: "button", onClick: () => setShowAddContact(false), className: "h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]", children: "Batal" }), _jsx("button", { type: "submit", className: "h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white", children: "Simpan kontak" })] })] })] }) }))] }));
}
