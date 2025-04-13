"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

function NavLinks({ className, onClick = () => {} }: NavLinksProps) {
  const links = [
    { href: "#features", label: "Recursos" },
    { href: "#about", label: "Sobre" },
    { href: "#contact", label: "Contato" },
  ];

  return (
    <nav className={className}>
      {links.map(link => (
        <a
          key={link.href}
          href={link.href}
          onClick={onClick}
          className="text-lg font-medium hover:text-[#FDCB6E]"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full p-4 flex items-center justify-between bg-white/40 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <Link href="/">
          <>
            <div className="block md:hidden">
              <Image
                src="/fandomize.png"
                alt="Logo Fandomize"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
            <div className="hidden md:block">
              <Image
                src="/fandomize.png"
                alt="Logo Fandomize"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </>
        </Link>
      </div>

      <NavLinks className="hidden md:flex gap-6" />

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle menu"
          className="focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#6C5CE7] text-white p-4 flex flex-col">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>
          <NavLinks
            className="mt-4 flex flex-col items-center gap-4"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
