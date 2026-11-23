export function AuthPhotoPanel() {
  return (
    <div className="relative hidden min-h-screen flex-1 overflow-hidden bg-night lg:block">
      <img
        src="/images/auth-banjir.webp"
        alt="Warga duduk di depan rumah yang terendam banjir di Jakarta Selatan"
        className="foto absolute inset-0 h-full w-full object-cover object-[50%_55%]"
      />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-night/95 via-night/60 to-transparent" />
      <div className="absolute bottom-14 left-14 max-w-lg pr-8">
        <p className="font-heading text-[38px] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
          Banjir datang tanpa janji. Langkah pertama sebaiknya sudah kamu tahu.
        </p>
        <p className="mt-4 text-[14px] text-white/65">Rawa Jati, Jakarta Selatan, Maret 2025. Foto: Iqro Rinaldi</p>
      </div>
    </div>
  );
}
