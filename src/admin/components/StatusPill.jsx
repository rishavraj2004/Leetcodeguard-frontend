export default function StatusPill({ tone = "grey", children }) {
  return (
    <span className={`ad-pill ${tone}`}>
      <span className="d" aria-hidden="true" />
      {children}
    </span>
  );
}
