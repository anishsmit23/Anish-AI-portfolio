/**
 * message-loading.tsx – Typing indicator
 * Three-dot SVG loading animation rendered inside chat bubbles while a
 * message is being generated; the dots bounce in a staggered chain driven
 * purely by SVG <animate> elements (no JavaScript).
 */
// @hidden
export default function MessageLoading() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle cx="4" cy="12" r="2" fill="currentColor">
        {/* First dot: bounces cy 12 -> 6 -> 12 over 0.6s with spline easing;
            its id is referenced by the other dots to stagger the wave. */}
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="2" fill="currentColor">
        {/* Second dot starts 0.1s after the first, creating the wave. */}
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="2" fill="currentColor">
        {/* Third dot trails by 0.2s; when it ends (+0.8s) the first dot
            restarts (begin="0;spinner_OcgL.end+0.25s"), looping forever. */}
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}
