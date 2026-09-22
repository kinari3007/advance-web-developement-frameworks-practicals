// Cosmic Wave Visual — replaces the previous jellyfish concept.
// Pure SVG + CSS: flowing galaxy streams, contour lines, star particles,
// blue/purple glows. No new dependencies. Fully animated via CSS.

export default function JellyfishVisual() {
  return (
    <div className="cosmic-visual" aria-hidden="true">
      <div className="cosmic-visual-inner">

        {/* Star particle field */}
        <div className="wave-stars" />

        {/* Glow orbs — deep background depth */}
        <div className="wave-glow-1" style={{ width: '55%', height: '45%', top: '10%', left: '15%' }} />
        <div className="wave-glow-2" style={{ width: '45%', height: '55%', top: '40%', right: '5%' }} />

        {/* Flowing contour SVG — inspired by ocean current maps + Van Gogh swirl */}
        <svg
          className="wave-svg"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="cg1" cx="45%" cy="35%" r="55%">
              <stop offset="0%"   stopColor="#4DB8FF" stopOpacity="0.35" />
              <stop offset="50%"  stopColor="#247BD1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#020611" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cg2" cx="65%" cy="65%" r="50%">
              <stop offset="0%"   stopColor="#6C5CCF" stopOpacity="0.28" />
              <stop offset="60%"  stopColor="#4C3B91" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020611" stopOpacity="0" />
            </radialGradient>
            <filter id="wave-blur-sm">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
            <filter id="wave-blur-lg">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soft glow fills */}
          <ellipse cx="230" cy="280" rx="220" ry="180" fill="url(#cg1)" />
          <ellipse cx="400" cy="520" rx="200" ry="220" fill="url(#cg2)" />

          {/* === Outer contour wave system === */}
          {/* Each group is offset to create depth layering */}

          {/* Layer 1 — widest, faintest: cosmic scale currents */}
          <g opacity="0.18" filter="url(#wave-blur-sm)" className="wave-path-2">
            <path d="M-20,180 C80,100 200,320 320,240 C440,160 520,380 620,300" strokeWidth="1.5" />
            <path d="M-20,300 C100,220 240,400 360,320 C480,240 540,440 640,380" strokeWidth="1" />
            <path d="M-20,420 C120,340 260,500 380,420 C500,340 560,520 660,460" strokeWidth="0.8" />
            <path d="M-20,540 C140,460 280,600 400,520 C520,440 580,600 680,540" strokeWidth="0.7" />
          </g>

          {/* Layer 2 — mid contours: ocean current flow lines */}
          <g className="wave-path-1">
            {/* Primary swirl — upper */}
            <path d="M 40,60 C 120,20 280,80 300,160 C 320,240 220,300 260,380 C 300,460 440,420 480,340 C 520,260 460,160 520,80" />
            <path d="M 60,90 C 140,50 300,110 320,190 C 340,270 240,330 280,410 C 320,490 460,450 500,370 C 540,290 480,190 540,110" />
            {/* Secondary swirl — lower */}
            <path d="M 80,400 C 160,340 300,420 340,500 C 380,580 300,640 360,700 C 420,760 520,720 560,640" />
            <path d="M 60,440 C 140,380 280,460 320,540 C 360,620 280,680 340,740 C 400,800 500,760 540,680" />
            {/* Connecting stream */}
            <path d="M 180,180 C 240,260 200,360 260,440 C 320,520 400,500 440,580 C 480,660 440,740 500,780" />
          </g>

          {/* Layer 3 — inner bright: highlighted current cores */}
          <g className="wave-path-3" filter="url(#glow-filter)">
            <path d="M 100,120 C 180,60 320,140 340,220 C 360,300 260,360 300,440 C 340,520 460,480 500,400" />
            <path d="M 140,500 C 220,440 340,500 380,580 C 420,660 360,720 420,760" />
          </g>

          {/* Bright accent strands — like bioluminescent trails */}
          <g opacity="0.55" filter="url(#glow-filter)">
            <path
              d="M 200,100 C 260,160 240,260 300,320 C 360,380 420,360 460,440 C 500,520 480,620 540,660"
              fill="none"
              stroke="#4DB8FF"
              strokeWidth="0.7"
              strokeDasharray="4 8"
            />
            <path
              d="M 320,80 C 360,140 330,230 380,290 C 430,350 490,330 520,410"
              fill="none"
              stroke="#78D5FF"
              strokeWidth="0.5"
              strokeDasharray="3 12"
            />
          </g>

          {/* Star/node points — glowing intersection markers */}
          <g filter="url(#glow-filter)" opacity="0.8">
            <circle cx="300" cy="220" r="2.5" fill="#78D5FF" />
            <circle cx="440" cy="380" r="1.8" fill="#4DB8FF" />
            <circle cx="200" cy="460" r="2"   fill="#6C5CCF" />
            <circle cx="360" cy="580" r="1.5" fill="#78D5FF" />
            <circle cx="480" cy="160" r="2"   fill="#4DB8FF" />
            <circle cx="140" cy="320" r="1.5" fill="#6C5CCF" />
            <circle cx="520" cy="560" r="2.2" fill="#4DB8FF" />
          </g>

          {/* Larger glowing halos on key nodes */}
          <g opacity="0.25" filter="url(#wave-blur-lg)">
            <circle cx="300" cy="220" r="18" fill="#4DB8FF" />
            <circle cx="440" cy="380" r="14" fill="#6C5CCF" />
            <circle cx="200" cy="460" r="16" fill="#247BD1" />
            <circle cx="480" cy="160" r="12" fill="#4DB8FF" />
          </g>

          {/* Fine particle dots scattered across field */}
          <g opacity="0.6">
            {[
              [80, 200], [150, 140], [420, 100], [540, 200], [60, 520],
              [580, 460], [260, 620], [480, 700], [340, 760], [100, 680],
              [560, 340], [380, 200], [240, 480], [500, 600], [160, 580],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 3 === 0 ? 1.2 : i % 3 === 1 ? 0.8 : 1}
                fill={i % 2 === 0 ? '#78D5FF' : '#D7E4F5'}
                opacity={0.4 + (i % 4) * 0.15}
              />
            ))}
          </g>
        </svg>

      </div>
    </div>
  )
}
