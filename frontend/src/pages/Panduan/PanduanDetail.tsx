import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { FASE_LABEL, findGuide, type Fase } from "@/content/panduan";

const FASES: Fase[] = ["sebelum", "saat", "sesudah"];

export function PanduanDetail() {
  const { jenis } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const guide = findGuide(jenis);
  const fase: Fase = (params.get("fase") as Fase) ?? "sebelum";

  if (!guide) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="text-[#475569]">Panduan tidak ditemukan.</p>
        <Link to="/panduan" className="mt-4 inline-block text-[#C2410C]">
          Kembali ke daftar panduan
        </Link>
      </div>
    );
  }

  const content = guide.fase[fase];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 pt-28 pb-24 md:px-[100px]">

      <div className="relative z-10 mx-auto max-w-[1240px]">
        {/* Back link (Node 1347) */}
        <Link
          to="/panduan"
          className="inline-block text-[14px] font-medium text-[#475569] hover:text-[#0B2545]"
        >
          ← Panduan bencana
        </Link>

        {/* Judul Header Card (persis siagakeluarga.fig Node 1362) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[#E2E8F0] bg-[#F1F5F9] px-7 py-6">
          <div>
            <h1
              className="text-[40px] leading-[1.1] font-bold tracking-[-0.02em] md:text-[56px]"
              style={{ color: guide.color }}
            >
              {guide.label}
            </h1>
            <p className="mt-3 text-[17px] text-[#475569]">{guide.deskripsi}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="h-[52px] rounded-full bg-[#C2410C] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#9A3412]"
          >
            + Tambahkan ke rencana saya
          </button>
        </div>

        {/* Tabs Sebelum / Saat / Sesudah (persis Node 1368) */}
        <div className="mt-10 flex w-full max-w-[320px] gap-1.5 rounded-[10px] border border-[#E2E8F0] bg-white p-[5px]">
          {FASES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setParams({ fase: f })}
              className={`flex-1 rounded-[7px] py-1.5 text-[17px] transition-colors ${
                fase === f
                  ? "bg-[#0B2545] font-semibold text-white"
                  : "font-medium text-[#475569] hover:text-[#0B2545]"
              }`}
            >
              {FASE_LABEL[f]}
            </button>
          ))}
        </div>

        {/* 2-Column Content (persis Node 1310) */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Kolom Kiri: Langkah + Catatan & Kontak Darurat (Node 1311..1350) */}
          <div className="space-y-4">
            {content.langkah.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-5 rounded-[16px] border border-[#E2E8F0] bg-white px-6 py-[22px]"
              >
                <span className="text-[20px] font-normal text-[#C2410C]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[17px] leading-[1.5] text-[#0B2545]">
                  {step}
                </p>
              </div>
            ))}

            {/* Catatan & Kontak Darurat (Node 1350) */}
            <div className="mt-6 rounded-[16px] border border-[#FDBA74] bg-[#FFF7ED] px-6 py-5">
              <p className="text-[14px] font-semibold text-[#9A3412]">
                Yang harus dihindari &amp; Kontak Cepat BNPB/BPBD
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#475569]">
                {guide.kontak}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Kotak Yang Perlu Disiapkan & Kartu Bantuan (Node 1327..1341) */}
          <div className="space-y-6">
            {/* Kotak Yang Perlu Disiapkan (Node 1327) */}
            <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F1F5F9] p-7">
              <p className="text-[19px] font-semibold text-[#0B2545]">
                Yang perlu disiapkan
              </p>
              <ul className="mt-4 space-y-4">
                {content.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[15px] text-[#0B2545]"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-[#C2410C] text-white">
                      <Check className="size-3.5 stroke-[3]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kartu Bantuan Tanya Siaga (Node 1341) */}
            <div className="rounded-[20px] border border-[#E2E8F0] bg-[#F1F5F9] p-7">
              <p className="text-[17px] font-semibold text-[#0B2545]">
                Masih bingung?
              </p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#475569]">
                Tanya Siaga bisa jelaskan panduan ini dengan bahasa yang lebih
                sederhana.
              </p>
              <Link
                to="/tanya"
                className="mt-3 inline-block text-[14px] font-semibold text-[#C2410C] hover:underline"
              >
                Tanya Siaga sekarang →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambahkan ke Rencana (persis siagakeluarga.fig Node 1419) */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#060B14]/55 p-4"
        >
          <div className="w-full max-w-[520px] rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold text-[#0B2545]">
                Tambahkan Panduan ke Rencana
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex size-8 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-lg font-bold text-[#475569]"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-[14px] text-[#475569]">
              Langkah untuk skenario {guide.label} akan ditambahkan ke rencana keluargamu.
            </p>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-[#F1F5F9] p-3.5 text-[14px] font-medium text-[#0B2545]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-[#C2410C] text-xs font-bold text-white">
                  ✓
                </span>
                <span>
                  Masukkan semua fase (Sebelum, Saat, dan Sesudah {guide.label})
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-[#F1F5F9] p-3.5 text-[14px] font-medium text-[#0B2545]">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-[#C2410C] text-xs font-bold text-white">
                  ✓
                </span>
                <span>Sinkronkan 3 barang wajib ke checklist Tas Siaga</span>
              </div>
              <div className="flex items-center gap-3 rounded-[12px] border border-[#E2E8F0] bg-white p-3.5 text-[14px] text-[#475569]">
                <span className="size-5 shrink-0 rounded-[6px] border-[1.5px] border-[#CBD5E1] bg-white" />
                <span>Kirim notifikasi pembaruan ke anggota keluarga lainnya</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-11 rounded-[10px] border border-[#CBD5E1] bg-white px-5 text-[14px] font-semibold text-[#0B2545]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  navigate("/rencana");
                }}
                className="h-11 rounded-[10px] bg-[#C2410C] px-6 text-[14px] font-semibold text-white"
              >
                Simpan ke Rencana Saya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
