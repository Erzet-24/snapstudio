export default function Countdown({ value }: { value: number | null }) {
  if (value === null) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center bg-plum/10" aria-live="assertive">
      <span key={value} className="animate-pop font-script text-[9rem] leading-none text-white drop-shadow-[0_6px_18px_rgba(74,47,117,0.6)] sm:text-[12rem]">
        {value}
      </span>
    </div>
  );
}
