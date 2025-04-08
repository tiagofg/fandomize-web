import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="
        w-full p-4 flex items-center justify-between
        text-white
        bg-white/40
        backdrop-blur-lg
        shadow-lg
      "
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="hidden md:flex">
          <Image
            src="/fandomize.png"
            alt="Logo Fandomize"
            width={80}
            height={80}
            unoptimized
            priority
            className="object-contain"
          />
        </Link>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="#features" className="text-lg font-medium hover:text-[#FDCB6E]">
          Recursos
        </a>
        <a href="#about" className="text-lg font-medium hover:text-[#FDCB6E]">
          Sobre
        </a>
        <a href="#contact" className="text-lg font-medium hover:text-[#FDCB6E]">
          Contato
        </a>
      </nav>
    </header>
  );
}
