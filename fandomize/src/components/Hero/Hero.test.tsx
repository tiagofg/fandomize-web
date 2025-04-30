/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "./Hero";

describe("Hero Component", () => {
  it("renderiza o section com título, descrição e link corretos", () => {
    render(<Hero />);

    // Título (h2)
    const title = screen.getByRole("heading", {
      level: 2,
      name: "Transporte suas fotos para universos épicos!",
    });
    expect(title).toBeInTheDocument();

    // Descrição
    expect(
      screen.getByText(
        /Pegue aquela sua foto comum e veja-a ganhar vida no visual da sua obra favorita/i,
      ),
    ).toBeInTheDocument();

    // Link principal
    const ctaLink = screen.getByRole("link", { name: "Começar Agora" });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/transformar");
  });

  it("o elemento section possui as classes CSS corretas", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section).toHaveClass(
      "w-full",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "text-center",
      "h-100%",
      "py-20",
      "px-4",
      "text-white",
    );
  });

  it("o título possui as classes de estilo corretas", () => {
    render(<Hero />);
    const title = screen.getByRole("heading", {
      level: 2,
      name: "Transporte suas fotos para universos épicos!",
    });
    expect(title).toHaveClass(
      "text-4xl",
      "md:text-5xl",
      "font-bold",
      "font-[Poppins]",
      "mb-6",
    );
  });

  it("o parágrafo possui as classes de estilo corretas", () => {
    render(<Hero />);
    const paragraph = screen.getByText(
      /Pegue aquela sua foto comum e veja-a ganhar vida no visual da sua obra favorita/i,
    );
    expect(paragraph).toHaveClass(
      "max-w-3xl",
      "text-lg",
      "md:text-xl",
      "font-[Inter]",
      "mb-10",
    );
  });

  it("o link de chamada possui as classes de botão corretas", () => {
    render(<Hero />);
    const ctaLink = screen.getByRole("link", { name: "Começar Agora" });
    expect(ctaLink).toHaveClass(
      "bg-white",
      "hover:bg-[#FDCB6E]",
      "transition-colors",
      "text-[#6C5CE7]",
      "font-medium",
      "py-3",
      "px-8",
      "rounded-full",
      "shadow-lg",
    );
  });

  it("combina com o snapshot", () => {
    const { asFragment } = render(<Hero />);
    expect(asFragment()).toMatchSnapshot();
  });
});
