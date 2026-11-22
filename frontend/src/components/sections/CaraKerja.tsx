import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { TopoBackground } from "@/components/layout/TopoBackground";

export function CaraKerja() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-white px-6 py-24 md:px-[100px] md:py-40"
    >
      <TopoBackground variant="light" />

      <div className="relative z-10 mx-auto max-w-[1134px]">
        <Reveal className="text-center">
          <p className="text-[13px] tracking-[0.04em] text-[#C2410C]">
            Cara kerja
          </p>
          <h2 className="mt-6 text-3xl font-bold tracking-[-0.025em] text-[#0B2545] md:text-[40px] md:leading-[1.1]">
            Cara kerja SiagaKeluarga
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-3 lg:gap-12">
          {/* Langkah 01 — Isi profil keluarga (persis siagakeluarga.fig Node 675..693) */}
          <Reveal
            delay={0}
            className="relative flex flex-col items-center gap-5 lg:items-start"
          >
            <div className="relative flex h-[420px] w-full max-w-[346px] flex-col gap-3 rounded-[28px] bg-[#F4F1EA] p-6">
              <p className="text-[16px] font-semibold text-[#0F172A]">
                Profil keluarga
              </p>

              <div className="flex h-16 items-center gap-3 rounded-[16px] bg-white px-4">
                <span className="size-8 shrink-0 rounded-full bg-[#0B2545]" />
                <span className="text-[15px] font-medium text-[#0F172A]">
                  Budi (Ayah)
                </span>
              </div>

              <div className="flex h-16 items-center gap-3 rounded-[16px] bg-white px-4">
                <span className="size-8 shrink-0 rounded-full bg-[#C2410C]" />
                <span className="text-[15px] font-medium text-[#0F172A]">
                  Nenek Aminah (72 thn)
                </span>
              </div>

              <div className="flex h-[54px] items-center gap-2.5 rounded-[12px] border border-[#E2E8F0] bg-white px-4">
                <span className="size-7 shrink-0 rounded-full bg-[#13345D]" />
                <span className="text-[14px] font-medium text-[#0F172A]">
                  Sari, Ibu (Hamil)
                </span>
              </div>

              <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="text-[11px] text-[#475569]">
                  Lokasi rumah terdaftar
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#0B2545]">
                  Kel. Dayeuhkolot, Kab. Bandung
                </p>
              </div>
            </div>

            {/* Panah 1 (Node 729) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[192px] -right-8 z-20 hidden size-9 items-center justify-center rounded-full border-[1.5px] border-[#C2410C] bg-[#FFF7ED] text-[15px] font-bold text-[#C2410C] lg:flex"
            >
              →
            </div>

            <p className="flex items-center gap-3 text-[19px] font-semibold text-[#0F172A]">
              <span className="text-[20px] font-normal text-[#C2410C]">01</span>
              Isi profil keluarga
            </p>
          </Reveal>

          {/* Langkah 02 — AI menyusun rencana (persis siagakeluarga.fig Node 694..714) */}
          <Reveal
            delay={0.08}
            className="relative flex flex-col items-center gap-5 lg:items-start"
          >
            <div className="relative flex h-[420px] w-full max-w-[346px] flex-col gap-3 rounded-[28px] bg-[#F4F1EA] p-6">
              <p className="text-[16px] font-semibold text-[#0F172A]">
                AI sedang menyusun
              </p>

              <div className="flex h-[22px] items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-[#C2410C] text-white">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
                <span className="text-[15px] text-[#0F172A]">
                  Menilai risiko lokasi
                </span>
              </div>

              <div className="flex h-[22px] items-center gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-[#C2410C] text-white">
                  <Check className="size-3.5 stroke-[3]" />
                </span>
                <span className="text-[15px] text-[#0F172A]">
                  Menyusun tugas tiap anggota
                </span>
              </div>

              <div className="flex h-[22px] items-center gap-2.5">
                <span className="size-5 shrink-0 rounded-[6px] border-[1.5px] border-[#0B2545]" />
                <span className="text-[15px] text-[#475569]">
                  Menulis daftar tas siaga…
                </span>
              </div>

              <div className="mt-1 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3.5">
                <p className="text-[11px] font-semibold text-[#C2410C]">
                  Rencana siap dalam 30 detik
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#0B2545]">
                  Titik kumpul: Aula Masjid Agung (400 m)
                </p>
                <p className="mt-1 text-[12px] text-[#475569]">
                  12 barang tas siaga disesuaikan untuk lansia &amp; anak.
                </p>
              </div>
            </div>

            {/* Panah 2 (Node 730) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[192px] -right-8 z-20 hidden size-9 items-center justify-center rounded-full border-[1.5px] border-[#C2410C] bg-[#FFF7ED] text-[15px] font-bold text-[#C2410C] lg:flex"
            >
              →
            </div>

            <p className="flex items-center gap-3 text-[19px] font-semibold text-[#0F172A]">
              <span className="text-[20px] font-normal text-[#C2410C]">02</span>
              AI menyusun rencana
            </p>
          </Reveal>

          {/* Langkah 03 — Bagikan dan latihan (persis siagakeluarga.fig Node 715..728) */}
          <Reveal
            delay={0.16}
            className="flex flex-col items-center gap-5 lg:items-start"
          >
            <div className="relative flex h-[420px] w-full max-w-[346px] flex-col gap-3 rounded-[28px] bg-[#F4F1EA] p-6">
              <p className="text-[16px] font-semibold text-[#0F172A]">
                Bagikan ke keluarga
              </p>

              <div className="rounded-[16px] bg-white p-4">
                <p className="text-[13px] text-[#475569]">
                  Link rencana darurat
                </p>
                <p className="mt-1.5 text-[15px] font-semibold text-[#C2410C]">
                  siagakeluarga.id/r/8f2a
                </p>
              </div>

              <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3.5">
                <p className="text-[13px] font-semibold text-[#0B2545]">
                  Akses cepat seluruh keluarga
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#475569]">
                  Kirim ke WhatsApp grup keluarga atau unduh PDF siap cetak A4.
                </p>
                <div className="mt-2.5 rounded-[8px] bg-[#C2410C] py-2 text-center text-[12px] font-semibold text-white">
                  Bagikan ke WhatsApp
                </div>
              </div>
            </div>

            <p className="flex items-center gap-3 text-[19px] font-semibold text-[#0F172A]">
              <span className="text-[20px] font-normal text-[#C2410C]">03</span>
              Bagikan dan latihan
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
