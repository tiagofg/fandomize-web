import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6C5CE7] to-[#00B894]">
      <Header />
      <main className="flex flex-grow">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
