export default function JellyfishVisual() {
  return (
    <div className="jellyfish-scene" aria-hidden="true">
      <div className="jellyfish-haze" />
      <div className="jellyfish-ray ray-one" />
      <div className="jellyfish-ray ray-two" />
      <svg className="jellyfish-svg" viewBox="0 0 360 440" role="presentation">
        <defs>
          <radialGradient id="bellGlow" cx="50%" cy="22%" r="72%">
            <stop offset="0" stopColor="#f5faff" stopOpacity=".9" />
            <stop offset=".14" stopColor="#7ddfff" stopOpacity=".7" />
            <stop offset=".47" stopColor="#19c8f2" stopOpacity=".58" />
            <stop offset=".78" stopColor="#5140a8" stopOpacity=".82" />
            <stop offset="1" stopColor="#160f4b" stopOpacity=".2" />
          </radialGradient>
          <linearGradient id="bellEdge" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#b9f2ff" stopOpacity=".65" />
            <stop offset=".52" stopColor="#4ca9ed" stopOpacity=".4" />
            <stop offset="1" stopColor="#e51b87" stopOpacity=".72" />
          </linearGradient>
          <linearGradient id="cyanTentacle" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#f5faff" stopOpacity=".9" />
            <stop offset=".28" stopColor="#7ddfff" />
            <stop offset="1" stopColor="#19c8f2" stopOpacity=".05" />
          </linearGradient>
          <linearGradient id="pinkTentacle" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#ffd5ee" />
            <stop offset=".3" stopColor="#e51b87" />
            <stop offset="1" stopColor="#e51b87" stopOpacity=".05" />
          </linearGradient>
          <linearGradient id="reefGradient" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="#5140a8" stopOpacity=".28" />
            <stop offset="1" stopColor="#020b18" stopOpacity=".85" />
          </linearGradient>
          <radialGradient id="bellCore" cx="50%" cy="35%" r="60%">
            <stop stopColor="#f5faff" stopOpacity=".4" />
            <stop offset=".55" stopColor="#7ddfff" stopOpacity=".08" />
            <stop offset="1" stopColor="#e51b87" stopOpacity=".24" />
          </radialGradient>
          <filter id="softBlur"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="strandGlow"><feGaussianBlur stdDeviation="2.5" /></filter>
          <filter id="bubbleGlow"><feGaussianBlur stdDeviation="1.8" /></filter>
        </defs>

        <g className="jellyfish-bubbles">
          <circle cx="56" cy="166" r="4" /><circle cx="306" cy="116" r="3" />
          <circle cx="285" cy="249" r="5" /><circle cx="77" cy="293" r="2.5" />
          <circle cx="322" cy="337" r="2" /><circle cx="38" cy="350" r="3" />
          <circle cx="42" cy="224" r="1.5" /><circle cx="326" cy="188" r="2" />
          <circle cx="61" cy="388" r="2" /><circle cx="293" cy="385" r="3" />
          <circle cx="89" cy="104" r="1.5" /><circle cx="264" cy="72" r="2" />
        </g>

        <path className="reef-back" d="M0 418c19-24 26-5 41-28 15 21 25 17 37-8 13 17 26 12 38-17 15 24 26 15 38-8 16 24 28 25 42 4 13 17 24 16 39-7 12 22 29 28 45 8 11 14 21 18 33 2 13 24 27 16 37-10v77H0Z" fill="url(#reefGradient)" />
        <path className="reef-front" d="M0 439c23-19 31-29 43-6 10-28 22-33 33-5 14-23 27-21 38 4 14-31 27-32 42-5 12-22 25-21 38 3 18-33 33-28 44-3 15-25 28-22 40 1 15-19 29-17 42 5 14-27 27-22 40-9v16H0Z" />

        <ellipse className="bell-aura" cx="180" cy="116" rx="125" ry="73" filter="url(#softBlur)" />
        <path className="bell-shadow" d="M63 111C67 49 112 19 180 19s113 30 117 92c-6 43-57 69-117 69S69 154 63 111Z" />
        <path className="bell" d="M63 111C67 49 112 19 180 19s113 30 117 92c-6 43-57 69-117 69S69 154 63 111Z" fill="url(#bellGlow)" stroke="url(#bellEdge)" strokeWidth="2" />
        <path className="bell-core" d="M85 111c8-48 45-77 95-77s87 29 95 77c-20-25-53-39-95-39s-75 14-95 39Z" fill="url(#bellCore)" />
        <path className="bell-rim" d="M67 111c15 34 59 55 113 55s98-21 113-55c-18 20-60 31-113 31S85 131 67 111Z" />
        <path className="bell-structure" d="M105 89c20-37 60-52 77-51m-2 1c19 5 44 18 63 49M135 44c-14 26-18 53-12 84m105-84c14 25 18 53 12 84M180 35v103M94 111c27-18 55-27 86-27s59 9 86 27M113 127c21-11 44-16 67-16s46 5 67 16" />
        <ellipse className="bell-highlight" cx="174" cy="63" rx="37" ry="17" />

        <g className="jellyfish-strands" fill="none" strokeLinecap="round">
          <path className="strand-far" d="M104 166C75 214 105 244 75 288s-8 82-30 119" />
          <path className="strand-far" d="M126 169C108 230 138 248 116 300s-14 76 4 112" />
          <path className="strand-cyan" d="M145 166C129 207 158 239 145 282s-1 75-21 116" />
          <path className="strand-far" d="M136 167C112 202 123 229 102 265s-20 68-8 100" />
          <path className="strand-pink" d="M164 170C153 219 176 239 170 286s13 80-4 129" />
          <path className="strand-cyan thick" d="M181 169C178 216 199 238 193 288s14 72 3 123" />
          <path className="strand-pink thick" d="M198 168C207 217 189 249 211 293s2 77 15 111" />
          <path className="strand-cyan" d="M207 167C224 203 213 232 225 267s31 64 25 103" />
          <path className="strand-cyan" d="M218 164C238 210 211 240 237 281s25 71 11 104" />
          <path className="strand-far" d="M239 159C275 203 245 237 279 270s29 62 31 93" />
          <path className="strand-far" d="M116 166C83 201 97 237 67 262s-23 62-12 92" />
        </g>
        <g className="jellyfish-lobes">
          <path d="M111 157c13 12 20 20 28 27" /><path d="M139 160c10 15 17 23 24 29" />
          <path d="M177 163c3 16 5 24 7 30" /><path d="M207 160c-5 16-9 24-15 31" />
          <path d="M236 155c-12 14-18 22-26 30" />
        </g>
      </svg>
      <div className="jellyfish-foreground-particles"><i /><i /><i /><i /></div>
    </div>
  )
}
