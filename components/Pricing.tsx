"use client";

import Reveal from "./Reveal";
import MagneticButton from "./MagneticButton";
import { pricing } from "@/lib/data";

export default function Pricing() {
  return (
    <section id="pricing" className="section-shell py-[70px] md:py-[100px]">
      <Reveal>
        <div className="eyebrow">Pricing</div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mb-10 mt-3 font-display text-display font-semibold">
          Simple, fair, <span className="text-accent">transparent.</span>
        </h2>
      </Reveal>

      {/* Grid diubah menjadi md:grid-cols-4 untuk menampung card ke-4 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {pricing.map((tier, i) => (
          <Reveal key={tier.tier} delay={i * 0.06}>
            <div className="group relative h-full transition-transform duration-400 hover:-translate-y-1.5">
              {tier.featured && (
                <div
                  aria-hidden
                  className="absolute -inset-3 -z-10 rounded-[28px] bg-accent/20 opacity-60 blur-2xl"
                />
              )}
              
              <div
                className={`relative h-full rounded-[18px] border p-11 flex flex-col justify-between ${
                  tier.featured
                    ? "border-accent bg-gradient-to-b from-accent-dim to-transparent"
                    : "border-line bg-glass"
                }`}
              >
                <div>
                  {tier.featured && (
                    <div className="absolute -top-3 right-8 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-bg">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-[12px] uppercase tracking-[0.14em] text-ink-2">
                    {tier.tier}
                  </div>
                  
                  <div className="my-5 font-display text-[52px] leading-none">
                    {tier.fixed}
                    <span className="ml-1.5 font-body text-[15px] text-ink-2">
                      / project
                    </span>
                  </div>
                  
                  <ul className="mb-9">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 border-t border-line py-2.5 text-[13.5px] text-ink-2"
                      >
                        <span className="text-accent">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <MagneticButton
                  href="#contact"
                  className={`block w-full rounded-full border py-3.5 text-center text-[12px] uppercase tracking-[0.1em] transition-colors ${
                    tier.featured
                      ? "border-accent bg-accent text-bg"
                      : "border-line-2 hover:border-accent"
                  }`}
                >
                  {tier.cta}
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        ))}

        {/* Card Ke-4: HAVE A CUSTOM PROJECT? */}
        <Reveal delay={pricing.length * 0.06}>
          <div className="group relative h-full transition-transform duration-400 hover:-translate-y-1.5">
            <div className="relative h-full rounded-[18px] border border-line bg-glass p-11 flex flex-col justify-between items-start">
              <div className="w-full">
                <h3 className="font-display text-[20px] font-bold uppercase tracking-wide text-ink leading-snug mt-4">
                  Have a <br /> Custom Project?
                </h3>
                <p className="mt-6 text-[13px] text-ink-2 font-light leading-relaxed">
                  Let's discuss your ideas and bring them to life with a tailored plan that fits your exact needs.
                </p>
              </div>

              <div className="w-full mt-12">
                <MagneticButton
                  href="#contact"
                  className="group/btn inline-flex items-center justify-between w-full rounded-md border border-line-2 bg-bg/40 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:border-accent hover:bg-glass"
                >
                  Contact Me
                  <span className="text-[12px] text-ink-3 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 group-hover/btn:text-accent">
                    ↗
                  </span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}