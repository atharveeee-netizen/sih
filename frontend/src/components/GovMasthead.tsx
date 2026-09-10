/**
 * Official masthead band.
 *
 * Sits above every route so the product reads as a government service rather
 * than a consumer site. Deliberately plain and dense: an identity strip, not a
 * hero. Kept to a single row so it costs almost no vertical space on screen.
 */
export default function GovMasthead() {
  return (
    <div className="gov-masthead w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 h-9 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            aria-hidden="true"
            className="hidden sm:inline-block w-1.5 h-4 bg-amber shrink-0"
          />
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase truncate">
            <span lang="hi" className="font-normal normal-case tracking-normal">
              भारत सरकार
            </span>
            <span className="mx-1.5 opacity-40">|</span>
            Government of India
            <span className="hidden md:inline">
              <span className="mx-1.5 opacity-40">·</span>
              Ministry of MSME
            </span>
          </p>
        </div>

        <p className="text-[10px] sm:text-[11px] tracking-wider uppercase whitespace-nowrap opacity-80">
          <span className="hidden lg:inline">Khadi &amp; Village Industries Commission</span>
          <span className="lg:hidden">KVIC</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span className="font-mono">SIH 26021</span>
        </p>
      </div>
    </div>
  );
}
