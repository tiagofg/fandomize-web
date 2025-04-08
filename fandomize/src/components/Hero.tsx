import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center h-100% py-20 px-4 text-white">
      <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] mb-6">
        Sua imagem, seu fandom, seu estilo!
      </h2>
      <p className="max-w-2xl text-lg md:text-xl font-[Inter] mb-10">
        Transforme fotos comuns em universos extraordinários. Personalize suas imagens
        com os estilos dos seus personagens favoritos – seja de animes, filmes, séries ou jogos.
      </p>
      <Link
        href="/transformar"
        className="bg-white hover:bg-[#FDCB6E] transition-colors text-[#6C5CE7] font-medium py-3 px-8 rounded-full shadow-lg"
      >
        Transforme Agora
      </Link>
    </section>
  );
}
