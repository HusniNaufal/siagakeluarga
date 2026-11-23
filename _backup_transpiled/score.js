// Tidak ada endpoint GET /score di backend (berbeda dari docs/api-contract.md lama),
// jadi skor kesiapsiagaan dihitung di klien mengikuti rumus yang sama persis:
// 40% kelengkapan rencana + 40% checklist tas siaga + 20% latihan.
export function computeSkorKesiapan(params) {
    const skorRencana = params.adaRencana ? 100 : 0;
    const skorTas = params.persentaseTasSiaga;
    const skorLatihan = params.rataRataSkorLatihan ?? 0;
    return Math.round(skorRencana * 0.4 + skorTas * 0.4 + skorLatihan * 0.2);
}
