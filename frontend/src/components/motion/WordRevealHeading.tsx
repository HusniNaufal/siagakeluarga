import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface WordRevealHeadingProps {
  children?: string;
  text?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  scrub?: boolean | number;
  start?: string;
  end?: string;
  /** Durasi tiap kata saat animasi (detik). Default 0.5. Hanya berlaku bila scrub = false. */
  duration?: number;
  /** Jeda antar kata (detik). Default 0.12. */
  stagger?: number;
}

export function WordRevealHeading({
  children,
  text,
  className,
  as: Component = "h2",
  scrub = 0.6,
  start = "top 88%",
  end = "top 52%",
  duration = 0.5,
  stagger = 0.12,
}: WordRevealHeadingProps) {
  const content = text || children || "";
  const containerRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const words = content.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || wordsRef.current.length === 0) return;

    // Hormati pengaturan prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(wordsRef.current, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const targets = wordsRef.current.filter(Boolean);

    const tween = gsap.fromTo(
      targets,
      {
        opacity: 0.15,
        y: 14,
        filter: "blur(2px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger,
        duration: scrub ? undefined : duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start,
          end: scrub ? end : undefined,
          scrub: scrub || false,
          toggleActions: scrub ? undefined : "play none none reverse",
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [content, scrub, start, end, duration, stagger]);

  return (
    <Component ref={containerRef as any} className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(node) => {
            wordsRef.current[i] = node;
          }}
          className="inline-block mr-[0.28em] will-change-[opacity,transform,filter]"
        >
          {word}
        </span>
      ))}
    </Component>
  );
}
