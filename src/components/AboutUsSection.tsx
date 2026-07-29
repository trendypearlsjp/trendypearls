import React from 'react';
import { MapPin, Phone, Sparkles, HeartHandshake, ShieldCheck, Truck } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  return (
    <section className="glass-panel p-8 sm:p-12 my-12 border border-amber-500/30 bg-zinc-950/80 rounded-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" /> Based in Townsville
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
            About Trendy Pearls Fancy Store
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Townsville’s premier destination for kids toys, girls & boys dresses, designer silk sarees, readymade blouses, gold plated Kundan jhumkas, rings, and fancy accessories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Curated Quality Items</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every item in our Townsville fancy store is hand-picked for premium quality, vibrant craftsmanship, and elegant finish.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Direct WhatsApp Ordering</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Order directly via WhatsApp with zero hassle. Ask questions, request custom details, and get instant personal assistance.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">Fast Local Dispatch</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Serving Townsville and beyond with reliable customer support, live inventory availability, and fast order dispatch.
            </p>
          </div>
        </div>

        {/* Townsville Local SEO Content */}
        <div className="pt-6 border-t border-zinc-800/80 text-xs text-zinc-400 leading-relaxed space-y-3">
          <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
            Townsville Fancy Store & Boutique Keywords
          </h4>
          <p>
            Welcome to <strong className="text-white">Trendy Pearls Fancy Store</strong>, your trusted shop in Townsville for educational wooden kids toys, princess party frocks, traditional Kanjivaram soft silk sarees, readymade padded velvet blouses, 22K gold plated Kundan jhumkas, solitaire zircon rings, quilted crossbody handbags, and ladies heels.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-zinc-400 pt-2 font-mono">
            <span className="flex items-center gap-1 text-amber-400">
              <MapPin className="w-3.5 h-3.5" /> Townsville, Australia
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Phone className="w-3.5 h-3.5" /> WhatsApp Sales: +91 9037352739
            </span>
            <span>
              <ShieldCheck className="w-3.5 h-3.5 inline text-amber-400" /> Verified Fancy Store
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
