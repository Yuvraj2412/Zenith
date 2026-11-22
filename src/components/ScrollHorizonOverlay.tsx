export function ScrollHorizonOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 80% 18%, rgba(255, 122, 0, 0.10) 0%, transparent 45%), radial-gradient(circle at 18% 75%, rgba(0, 153, 255, 0.10) 0%, transparent 50%)",
      }}
    />
  );
}
