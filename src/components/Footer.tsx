import Link from "next/link";
import { Aperture } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-lilac/60 bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-plum-soft sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-plum">
          <Aperture className="h-5 w-5 text-blush-deep" /> SnapStudio
        </div>
        <div className="flex gap-5">
          <Link href="/photobooth" className="hover:text-plum">Photobooth</Link>
          <Link href="/gallery" className="hover:text-plum">Gallery</Link>
          <Link href="/profile" className="hover:text-plum">Profile</Link>
        </div>
        <p>© {new Date().getFullYear()} SnapStudio. Foto kamu tetap milikmu.</p>
      </div>
    </footer>
  );
}
