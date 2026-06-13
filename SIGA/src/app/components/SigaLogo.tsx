export function SigaLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Shield left half - navy */}
      <path d="M50 5 L10 20 L10 60 C10 82 28 97 50 105 L50 5Z" fill="#1b2d6b"/>
      {/* Shield right half - red */}
      <path d="M50 5 L90 20 L90 60 C90 82 72 97 50 105 L50 5Z" fill="#c41230"/>
      {/* Circular arrows white */}
      <path d="M35 42 C35 32 43 25 52 26 C58 26 63 30 66 35 L70 31 L68 42 L57 40 L61 37 C59 33 56 31 52 31 C46 31 40 36 40 42 C40 50 46 55 52 55 C56 55 59 53 61 50" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      <path d="M65 56 C65 66 57 73 48 72 C42 72 37 68 34 63 L30 67 L32 56 L43 58 L39 61 C41 65 44 67 48 67 C54 67 60 62 60 56 C60 48 54 43 48 43 C44 43 41 45 39 48" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
      {/* Arrow heads */}
      <polygon points="66,35 76,34 71,42" fill="white"/>
      <polygon points="34,63 24,64 29,56" fill="white"/>
      {/* SIGA text */}
      <text x="50" y="125" textAnchor="middle" fontFamily="'Roboto Condensed', sans-serif" fontWeight="700" fontSize="22" fill="#1b2d6b">SIGA</text>
    </svg>
  );
}
