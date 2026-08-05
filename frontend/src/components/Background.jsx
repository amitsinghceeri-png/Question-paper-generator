export default function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink via-white to-brand-glow" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl animate-float-1" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-accent/15 blur-3xl animate-float-2" />

      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-glow/40 blur-3xl animate-pulse" />
    </>
  );
}
