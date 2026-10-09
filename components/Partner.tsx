import Image from "next/image";
import Reveal from "./Reveal";

const partnerPortfolioUrl = "https://tuanmudael.vercel.app/";

export default function Partner() {
  return (
    <section id="partner" className="section-shell py-[70px] md:py-[100px]">
      <Reveal>
        <div className="eyebrow">Partner</div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mb-10 mt-3 font-display text-display font-semibold uppercase">
          Creative <span className="text-accent">collaboration.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <a
          href={partnerPortfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Tuan Muda El's portfolio (opens in a new tab)"
          className="group flex min-h-36 items-center justify-between gap-6 rounded-[18px] border border-line bg-glass p-6 transition-colors duration-300 hover:border-accent/60 hover:bg-accent/5 sm:p-8"
        >
          <span className="flex min-w-0 items-center gap-5 sm:gap-7">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line-2 bg-bg transition-colors duration-300 group-hover:border-accent/60 sm:h-20 sm:w-20">
              <Image
                src="/media/projects/el%20portrait.png"
                alt="Tuan Muda El"
                fill
                sizes="80px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.18em] text-ink-3">
                Portfolio Partner
              </span>
              <span className="block truncate font-display text-xl font-semibold uppercase tracking-wide text-ink transition-colors group-hover:text-accent sm:text-2xl">
                Tuan Muda El
              </span>
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-xl text-ink-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
          >
            ↗
          </span>
        </a>
      </Reveal>
    </section>
  );
}
