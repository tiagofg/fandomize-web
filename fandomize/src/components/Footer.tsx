export default function Footer() {
  return (
    <footer
      className="
        w-full p-4 text-white text-center
        bg-white/40
        backdrop-blur-lg
        shadow-lg
      "
    >
      <p className="text-sm font-[Inter]">
        &copy; {new Date().getFullYear()} Fandomize. Todos os direitos reservados.
      </p>
    </footer>
  );
}
