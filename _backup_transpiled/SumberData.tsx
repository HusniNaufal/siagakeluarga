/**
 * Strip sumber data. Bukan deretan logo mitra rekaan: yang tampil adalah
 * lembaga yang datanya benar-benar dipakai, supaya orang tahu angka dari mana.
 */
const SOURCES = [
  { name: "BMKG", note: "Prakiraan cuaca per kelurahan" },
  { name: "BNPB", note: "Data kejadian bencana" },
  { name: "BPBD", note: "Zona rawan dan titik kumpul" },
];

export function SumberData() {
  return (
    <section aria-label="Sumber data" className="border-y border-line bg-base">
      <div className="shell flex flex-col gap-4 py-7 md:flex-row md:items-center md:gap-12">
        <p className="shrink-0 text-[14px] text-muted">Data yang dipakai</p>
        <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
          {SOURCES.map((source) => (
            <li key={source.name} className="flex items-baseline gap-2.5">
              <span className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
                {source.name}
              </span>
              <span className="text-[14px] text-muted">{source.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
