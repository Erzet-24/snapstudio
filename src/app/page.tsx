import Link from "next/link";
import { Camera, Download, Heart, Images, Palette, Sparkles, Smile, Wand2 } from "lucide-react";

function HeroStrip() {
  const frames = [
    { bg: "linear-gradient(135deg,#FFC2DD,#FFE6C7)", icon: Heart },
    { bg: "linear-gradient(135deg,#D9C6FF,#C9E4FF)", icon: Smile },
    { bg: "linear-gradient(135deg,#FFE6C7,#FFC2DD)", icon: Sparkles },
    { bg: "linear-gradient(135deg,#C9E4FF,#D9C6FF)", icon: Heart },
  ];
  return (
    <div className="relative mx-auto h-[26rem] w-72 sm:h-[30rem] sm:w-80" aria-hidden="true">
      <div className="absolute -left-6 top-6 h-[88%] w-52 -rotate-[9deg] rounded-md bg-lilac p-3 shadow-paper sm:-left-10 sm:w-60">
        <div className="h-full rounded bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.55)_0_18px,transparent_18px_26px)]" />
      </div>
      <div className="absolute right-0 top-0 w-48 rotate-[5deg] rounded-md bg-white px-3.5 pb-4 pt-3.5 shadow-paper sm:w-56">
        <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-blush/80" />
        <div className="space-y-2.5">
          {frames.map((f, i) => (
            <div key={i} className="grid aspect-[4/3] place-items-center rounded-md" style={{ background: f.bg }}>
              <f.icon className="h-8 w-8 text-white/90" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-script text-lg text-blush-deep">hello, you!</p>
      </div>
      <div className="absolute -bottom-2 left-0 -rotate-6 rounded-full bg-blush-deep px-4 py-2 font-hand text-xl text-white shadow-soft">
        gratis dicoba
      </div>
    </div>
  );
}

const STEPS = [
  { title: "Pose", text: "Izinkan kamera, pilih filter, lalu hitung mundur 3, 2, 1 mengambil 3 atau 4 foto." },
  { title: "Dekor", text: "Susun jadi strip, ganti latar, tambah teks, tanggal, dan stiker." },
  { title: "Simpan", text: "Unduh PNG atau simpan ke gallery pribadimu." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-8 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tight text-plum sm:text-6xl lg:text-7xl">
            Capture Your Moments, Your Way.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-plum-soft">
            Photobooth langsung di browser. Pilih satu dari 8 filter, ambil beberapa foto dengan hitung mundur, lalu rangkai jadi photo strip yang kamu desain sendiri.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/photobooth" className="btn btn-pink px-7 py-3.5 text-base">
              <Camera className="h-5 w-5" /> Start Photobooth
            </Link>
            <Link href="/gallery" className="btn btn-ghost px-7 py-3.5 text-base">Buka Gallery</Link>
          </div>
        </div>
        <HeroStrip />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">Tiga langkah dari kamera ke gallery</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-lilac/60">
              <span className="font-script text-3xl text-blush-deep">{i + 1}</span>
              <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-plum-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-6">
        <div className="rotate-[-0.6deg] rounded-[2rem] bg-blush p-8 md:col-span-3">
          <Wand2 className="h-8 w-8" />
          <h3 className="mt-4 text-2xl font-bold">8 filter real-time</h3>
          <p className="mt-2 max-w-sm text-plum/80">Original, Vintage, Black & White, Warm, Cool, Pink, Soft, Retro. Terlihat langsung di preview dan ikut tercetak di hasil foto.</p>
        </div>
        <div className="rounded-[2rem] bg-lilac p-8 md:col-span-3 md:rotate-[0.6deg]">
          <Palette className="h-8 w-8" />
          <h3 className="mt-4 text-2xl font-bold">Editor strip lengkap</h3>
          <p className="mt-2 max-w-sm text-plum/80">Template, warna dan gradient, border, spasi, teks, tanggal otomatis, dan stiker yang bisa diseret.</p>
        </div>
        <div className="rounded-[2rem] bg-white p-8 ring-1 ring-lilac/70 md:col-span-2">
          <Download className="h-7 w-7 text-lilac-deep" />
          <h3 className="mt-3 text-xl font-bold">PNG resolusi tinggi</h3>
          <p className="mt-2 text-sm text-plum-soft">Diekspor 2× dari canvas, tajam untuk dicetak.</p>
        </div>
        <div className="rounded-[2rem] bg-white p-8 ring-1 ring-lilac/70 md:col-span-4">
          <Images className="h-7 w-7 text-lilac-deep" />
          <h3 className="mt-3 text-xl font-bold">Gallery pribadi yang aman</h3>
          <p className="mt-2 max-w-md text-sm text-plum-soft">Cari berdasarkan judul, filter berdasarkan tanggal. Row Level Security memastikan hanya kamu yang bisa mengubah atau menghapus strip milikmu.</p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-plum px-8 py-14 text-center text-cream sm:py-16">
          <span className="absolute -left-8 -top-8 h-36 w-36 rounded-full bg-blush-deep/50" />
          <span className="absolute -bottom-10 -right-6 h-44 w-44 rounded-full bg-lilac-deep/50" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Siap bergaya di depan kamera?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-cream/80">Tidak perlu akun untuk memotret dan mengunduh. Masuk saat kamu ingin menyimpan ke gallery.</p>
          <Link href="/photobooth" className="btn btn-pink relative mt-7 px-8 py-3.5 text-base">
            <Camera className="h-5 w-5" /> Mulai ambil foto
          </Link>
        </div>
      </section>
    </>
  );
}
