import BeevilKnievelLogo from "@/components/BeevilKnievelLogo";

/**
 * Site footer.
 *
 * Civic redesign: the authority names were set in large italic serif, which
 * read as a fashion masthead rather than a government notice. They are now
 * plain and structured. Secondary text also moves off `warm-grey`, which is a
 * mid slate and failed contrast against the dark panel.
 */
export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white border-t-[3px] border-amber">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14">
        <div className="mb-8">
          <BeevilKnievelLogo size="md" variant="full" theme="dark" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-8 border-b border-white/15">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-4">
              Collaborators &amp; Governance
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="font-semibold">Khadi and Village Industries Commission (KVIC)</li>
              <li className="text-white/75">National Bee Board &mdash; Honey Mission</li>
              <li className="text-white/60 text-xs pt-1">
                Ministry of Micro, Small &amp; Medium Enterprises, Government of India
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-4">
              Architectural Core
            </p>
            <p className="text-sm font-semibold mb-2">Beevil Knievel Universal Authentication</p>
            <p className="text-xs text-white/70 leading-relaxed">
              Decentralised provenance protocol combining a Polygon PoS immutable ledger,
              AI-driven anti-adulteration models, and physical tamper-evident micro-QR seals.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="bg-amber text-navy-deep px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider">
              SIH 2026 Finalist
            </span>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">
              Problem Statement: SIH26021
            </p>
          </div>
        </div>

        <p className="pt-6 text-[10px] uppercase tracking-wider text-white/55">
          &copy; 2026 Beevil Knievel &middot; Open source under the MIT License
        </p>
      </div>
    </footer>
  );
}
