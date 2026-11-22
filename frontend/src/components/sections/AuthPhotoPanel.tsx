export function AuthPhotoPanel() {
  return (
    <div className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#07090C] lg:block">
      <img
        src="/images/auth-hero.webp"
        alt="Keluarga Pratama di depan rumah, suasana tenang dan siap"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-gradient-to-t from-[#07090C]/95 via-[#07090C]/55 to-transparent" />
      <div className="absolute bottom-16 left-16 max-w-lg pr-8">
        <p className="text-4xl leading-[1.15] font-bold tracking-[-0.025em] text-white">
          Siap <span className="text-accent-dark">bersama</span> lebih kuat daripada menghadapi sendirian.
        </p>
        <p className="mt-4 font-mono text-[13px] tracking-[0.04em] text-[#94A3B8]">
          Keluarga Pratama, Dayeuhkolot, Kab. Bandung
        </p>
      </div>
    </div>
  );
}
