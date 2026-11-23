import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";
/** Jumlah frame di public/hero/d (desktop) dan public/hero/m (HP). */
export const HERO_FRAME_COUNT = 120;
function frameSrc(folder, i) {
    return `/hero/${folder}/${String(i + 1).padStart(3, "0")}.webp`;
}
/** Urutan muat: setiap frame ke-8 dulu (agar scroll cepat sudah punya gambar), lalu sisanya. */
function loadOrder(count) {
    const order = [];
    for (const step of [8, 4, 2, 1]) {
        for (let i = 0; i < count; i += step)
            if (!order.includes(i))
                order.push(i);
    }
    return order;
}
/**
 * Video hero yang digambar ke <canvas> frame demi frame mengikuti posisi scroll
 * (teknik "image sequence"). `progress` bernilai 0–1 dan dipetakan ke frame 0..count-1.
 */
export function HeroFrames({ progress, focalX = 0.6, className, }) {
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const currentRef = useRef(0);
    function draw(index) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx)
            return;
        // Pakai frame terdekat yang sudah termuat.
        const images = imagesRef.current;
        let img = null;
        for (let d = 0; d < HERO_FRAME_COUNT && !img; d++) {
            img = images[index - d] ?? images[index + d] ?? null;
        }
        if (!img)
            return;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        const x = (cw - w) * focalX;
        const y = (ch - h) / 2;
        ctx.drawImage(img, x, y, w, h);
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const folder = window.innerWidth < 768 ? "m" : "d";
        imagesRef.current = new Array(HERO_FRAME_COUNT).fill(null);
        let cancelled = false;
        function resize() {
            if (!canvas)
                return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(canvas.clientWidth * dpr);
            canvas.height = Math.round(canvas.clientHeight * dpr);
            draw(currentRef.current);
        }
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();
        // Muat bertahap, 6 gambar sekaligus.
        const queue = loadOrder(HERO_FRAME_COUNT);
        let active = 0;
        function next() {
            while (!cancelled && active < 6 && queue.length) {
                const i = queue.shift();
                const img = new Image();
                img.decoding = "async";
                img.src = frameSrc(folder, i);
                active++;
                img.onload = () => {
                    active--;
                    if (cancelled)
                        return;
                    imagesRef.current[i] = img;
                    if (Math.abs(i - currentRef.current) <= 8)
                        draw(currentRef.current);
                    next();
                };
                img.onerror = () => {
                    active--;
                    next();
                };
            }
        }
        next();
        return () => {
            cancelled = true;
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useMotionValueEvent(progress, "change", (v) => {
        const index = Math.min(HERO_FRAME_COUNT - 1, Math.max(0, Math.round(v * (HERO_FRAME_COUNT - 1))));
        if (index === currentRef.current)
            return;
        currentRef.current = index;
        requestAnimationFrame(() => draw(index));
    });
    return _jsx("canvas", { ref: canvasRef, className: className, "aria-hidden": "true" });
}
