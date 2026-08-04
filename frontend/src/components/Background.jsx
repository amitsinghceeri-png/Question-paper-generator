export default function Background() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100" />

      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-3xl animate-pulse" />

      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-3xl" />
    </>
  );
}
