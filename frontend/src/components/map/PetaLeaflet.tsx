import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

export interface TitikPeta {
  lat: number;
  lng: number;
  label: string;
  /** "rumah" = terakota, "kumpul" = navy, "aman" = hijau, "bantuan" = merah */
  jenis?: "rumah" | "kumpul" | "aman" | "bantuan";
}

const WARNA = { rumah: "#bc5b34", kumpul: "#10264a", aman: "#12805c", bantuan: "#c81e1e" } as const;

// Penanda bulat sederhana (divIcon) agar tidak bergantung pada gambar bawaan Leaflet yang sering rusak di bundler.
function ikon(jenis: NonNullable<TitikPeta["jenis"]>) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${WARNA[jenis]};border:3px solid #fff;box-shadow:0 1px 6px rgba(6,11,20,.45)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function PasPetaKeTitik({ titik }: { titik: TitikPeta[] }) {
  const map = useMap();
  useEffect(() => {
    if (titik.length === 0) return;
    if (titik.length === 1) map.setView([titik[0].lat, titik[0].lng], 16);
    else map.fitBounds(L.latLngBounds(titik.map((t) => [t.lat, t.lng] as [number, number])), { padding: [40, 40], maxZoom: 17 });
  }, [map, titik]);
  return null;
}

function PilihDiPeta({ onPilih }: { onPilih: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPilih(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))) });
  return null;
}

/**
 * Peta OpenStreetMap (tanpa kunci API). `titik` ditampilkan sebagai penanda dan peta otomatis menyesuaikan.
 * `onPilih`: bila diberikan, mengetuk peta memilih lokasi (dipakai untuk menandai rumah).
 */
export function PetaLeaflet({
  titik,
  onPilih,
  className,
  tinggi = 320,
}: {
  titik: TitikPeta[];
  onPilih?: (lat: number, lng: number) => void;
  className?: string;
  tinggi?: number;
}) {
  // Pusat awal: titik pertama, atau tengah Kota Bengkulu (wilayah percontohan) bila belum ada titik.
  const pusat: [number, number] = titik[0] ? [titik[0].lat, titik[0].lng] : [-3.7956, 102.2592];
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line", className)} style={{ height: tinggi }}>
      <MapContainer center={pusat} zoom={titik.length ? 15 : 12} scrollWheelZoom={false} className="size-full" aria-label="Peta">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PasPetaKeTitik titik={titik} />
        {onPilih && <PilihDiPeta onPilih={onPilih} />}
        {titik.map((t) => (
          <Marker key={`${t.lat},${t.lng},${t.label}`} position={[t.lat, t.lng]} icon={ikon(t.jenis ?? "kumpul")}>
            <Popup>{t.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
