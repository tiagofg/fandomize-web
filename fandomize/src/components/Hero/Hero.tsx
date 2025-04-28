import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center h-100% py-20 px-4 text-white">
      <h2 className="text-4xl md:text-5xl font-bold font-[Poppins] mb-6">
        Transporte suas fotos para universos épicos!
      </h2>
      <p className="max-w-3xl text-lg md:text-xl font-[Inter] mb-10">
        Pegue aquela sua foto comum e veja-a ganhar vida no visual da sua obra favorita — animações, filmes, séries ou games. Clique e descubra a magia!
      </p>
      <Link
        href="/transformar"
        className="bg-white hover:bg-[#FDCB6E] transition-colors text-[#6C5CE7] font-medium py-3 px-8 rounded-full shadow-lg"
      >
        Começar Agora
      </Link>
    </section>
  );
}
