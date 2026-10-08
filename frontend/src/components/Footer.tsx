import BeevilKnievelLogo from "@/components/BeevilKnievelLogo";

/** The people who built this. Kept here so the footer is the one place
    the roster is edited. */
const TEAM = [
  "Atharve Dahima",
  "Srajan Mishra",
  "Loshini Shankar",
  "Unnati",
  "Mohit",
  "Kavin",
];

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
      {/* The jury brief and IoT stage controls are fixed to the bottom
          corners, so the last lines of the footer need room to clear them
          rather than sitting underneath. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-14 pb-28 sm:pb-24">
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
              <li className="text-white/75">National Bee Board, Honey Mission</li>
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
              Decentralised provenance protocol combining an immutable blockchain ledger,
              AI-driven anti-adulteration models, and physical tamper-evident micro-QR seals.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="bg-amber text-navy-deep px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider">
              SIH 2026 Submission
            </span>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">
              Problem Statement: SIH26021
            </p>
          </div>
        </div>

        <div className="pt-6 pb-6 border-b border-white/15">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-white/55 mb-4">
            Team Beevil Knievel
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-2 text-sm">
            {TEAM.map((member) => (
              <li key={member} className="text-white/85">
                {member}
              </li>
            ))}
          </ul>
        </div>

        <p className="pt-6 text-[10px] uppercase tracking-wider text-white/55">
          &copy; 2026 Team Beevil Knievel &middot; All rights reserved
        </p>
        <p className="pt-1.5 text-[10px] text-white/45 normal-case tracking-normal">
          Includes MIT licensed components by other authors. See NOTICE in the
          project repository for the full attribution.
        </p>
      </div>
    </footer>
  );
}
