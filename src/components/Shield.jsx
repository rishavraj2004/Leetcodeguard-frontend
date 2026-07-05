export default function Shield({ armed, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 L19 6 V11.5 C19 16 16 19.2 12 21 C8 19.2 5 16 5 11.5 V6 Z"
        stroke={armed ? "#2E7D4F" : "#B9B2A6"}
        strokeWidth="1.8"
        fill={armed ? "rgba(46,125,79,0.12)" : "none"}
        strokeLinejoin="round"
      />
      {armed && (
        <path d="M9 12 L11.2 14.2 L15.2 9.8" stroke="#2E7D4F" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      )}
    </svg>
  );
}
