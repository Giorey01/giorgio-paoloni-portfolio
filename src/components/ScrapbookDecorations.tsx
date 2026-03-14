import React from "react";

// Componente per un pezzo di nastro adesivo semi-trasparente e stropicciato (Tape)
export const TapePiece = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute z-10 pointer-events-none ${className}`}
    width="120"
    height="35"
    viewBox="0 0 120 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Forma base del nastro con bordi irregolari */}
    <path
      d="M2.5 10.5C5 7.5 15 5.5 30 4.5C45 3.5 70 2.5 90 3.5C110 4.5 117 7 118 9.5C119 12 118.5 22 117.5 25C116.5 28 110 31.5 90 32C70 32.5 45 33 30 31.5C15 30 4 28 2.5 25C1 22 0 13.5 2.5 10.5Z"
      fill="rgba(245, 245, 235, 0.65)"
      stroke="rgba(230, 230, 220, 0.4)"
      strokeWidth="1.5"
    />
    {/* Texture del nastro - linee e pieghe casuali */}
    <path
      d="M10 8C15 15 20 20 25 28 M35 6C40 14 45 22 50 29 M60 5C65 12 70 20 75 28 M85 6C90 14 95 22 100 29"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5 15C30 14 70 16 115 14"
      stroke="rgba(0, 0, 0, 0.03)"
      strokeWidth="3"
    />
  </svg>
);

// Componente per un timbro postale circolare vintage
export const PostageStamp = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute z-10 pointer-events-none opacity-80 ${className}`}
    width="150"
    height="150"
    viewBox="0 0 150 150"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Cerchio esterno frastagliato */}
    <circle
      cx="75"
      cy="75"
      r="68"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeDasharray="4 6"
      className="opacity-70"
    />
    {/* Cerchio interno solido */}
    <circle
      cx="75"
      cy="75"
      r="58"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      className="opacity-80"
    />

    {/* Testo circolare (approssimato con path) e centrale */}
    <path
      id="curve"
      d="M 25 75 A 50 50 0 1 1 125 75 A 50 50 0 1 1 25 75"
      fill="transparent"
    />
    <text className="font-sans text-[12px] uppercase tracking-widest fill-[#1a1a1a] opacity-90">
      <textPath href="#curve" startOffset="10%">
        ARCHIVE DPT. • VOL. 01 •
      </textPath>
    </text>

    {/* Data centrale e stelle */}
    <text x="75" y="70" textAnchor="middle" className="font-serif italic text-lg fill-[#1a1a1a] opacity-90">
      Est.
    </text>
    <text x="75" y="90" textAnchor="middle" className="font-serif text-xl font-bold fill-[#1a1a1a] opacity-90">
      2024
    </text>

    {/* Linee ondulate laterali del timbro */}
    <path
      d="M10 75 Q 20 65 30 75 T 50 75"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      className="opacity-60"
    />
    <path
      d="M100 75 Q 110 85 120 75 T 140 75"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      className="opacity-60"
    />
  </svg>
);

// Componente per una macchia o texture di carta sottile
export const PaperTexture = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute pointer-events-none opacity-20 mix-blend-multiply ${className}`}
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="4"
        stitchTiles="stitch"
      />
      <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" fill="transparent" />
  </svg>
);

// Etichetta o "Label" fotografica da attaccare sulle foto
export const PhotoLabel = ({ text, className = "" }: { text: string; className?: string }) => (
  <div className={`absolute z-10 bg-[#fdfdfd] border border-gray-300 shadow-sm px-3 py-1 font-sans text-xs uppercase tracking-widest text-gray-800 transform -rotate-2 ${className}`}>
    <div className="border border-dotted border-gray-400 p-1">
      {text}
    </div>
  </div>
);

// Componente per un timbro di approvazione / censura rosso o nero
export const ApprovalStamp = ({ text, color = "#a32a2a", className = "" }: { text: string; color?: string; className?: string }) => (
  <div
    className={`absolute z-10 font-serif font-bold text-4xl uppercase tracking-tighter opacity-70 transform rotate-[-15deg] mix-blend-multiply pointer-events-none ${className}`}
    style={{
      color,
      border: `4px solid ${color}`,
      padding: '4px 12px',
      borderRadius: '4px',
      textShadow: `0 0 2px ${color}` // Simulazione inchiostro sbavato
    }}
  >
    {text}
  </div>
);

// Disegno a mano libera - Freccia o cerchio scarabocchiato
export const ScribbleCircle = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute z-10 pointer-events-none opacity-60 ${className}`}
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 50 C 10 20, 80 10, 90 40 C 100 70, 40 95, 20 80 C 0 65, 30 15, 60 25"
      stroke="#1a1a1a"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="transparent"
      className="stroke-gray-800"
      style={{ strokeDasharray: '400', strokeDashoffset: '0' }}
    />
  </svg>
);
