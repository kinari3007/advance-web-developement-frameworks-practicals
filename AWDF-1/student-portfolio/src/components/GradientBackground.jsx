export default function GradientBackground() {
  return (
    <div className="cosmic-bg" aria-hidden="true">
      {/* Deep space base handled by ::before pseudo */}
      {/* Star field handled by ::after pseudo */}

      {/* Flowing cosmic ocean currents */}
      <div className="cosmic-wave-1" />
      <div className="cosmic-wave-2" />

      {/* Drifting particles */}
      <div className="cosmic-particles" />

      {/* Contour lines — inspired by ocean current maps */}
      <div className="cosmic-contour" />

      {/* Bottom depth fade */}
      <div className="cosmic-depth" />
    </div>
  )
}
