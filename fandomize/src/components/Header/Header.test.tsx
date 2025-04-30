/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./Header";

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o header com a estrutura correta", () => {
    render(<Header />);

    // Header (role banner)
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Duas imagens com alt "Logo Fandomize"
    const logos = screen.getAllByAltText("Logo Fandomize");
    expect(logos).toHaveLength(2);

    // Ambas dentro de um <a href="/">
    const link = logos[0].closest("a");
    expect(link).toHaveAttribute("href", "/");

    // Links do menu desktop
    const recursosLink = screen.getByRole("link", { name: "Recursos" });
    expect(recursosLink).toHaveAttribute("href", "#features");

    const sobreLink = screen.getByRole("link", { name: "Sobre" });
    expect(sobreLink).toHaveAttribute("href", "#about");

    const contatoLink = screen.getByRole("link", { name: "Contato" });
    expect(contatoLink).toHaveAttribute("href", "#contact");
  });

  it("o header possui as classes CSS corretas", () => {
    const { container } = render(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass(
      "w-full",
      "md:p-4",
      "py-0",
      "px-2",
      "flex",
      "items-center",
      "justify-between",
      "bg-white/40",
      "text-white",
      "shadow-lg",
    );
  });

  it("combina com o snapshot", () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("não exibe o menu mobile por padrão", () => {
    render(<Header />);
    expect(document.querySelector("div.fixed.inset-0")).not.toBeInTheDocument();
  });

  it("abre e fecha o menu mobile ao clicar no toggle", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Toggle menu");

    // Abre
    fireEvent.click(toggleButton);
    const overlay = document.querySelector("div.fixed.inset-0");
    expect(overlay).toBeInTheDocument();

    // Fecha via mesmo botão
    fireEvent.click(toggleButton);
    expect(document.querySelector("div.fixed.inset-0")).not.toBeInTheDocument();
  });

  it("fecha o menu mobile ao clicar no botão de fechar interno", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));

    const closeButton = screen.getByLabelText("Close menu");
    fireEvent.click(closeButton);

    expect(document.querySelector("div.fixed.inset-0")).not.toBeInTheDocument();
  });

  it("fecha o menu mobile ao clicar em um link do menu", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));

    const overlay = document.querySelector("div.fixed.inset-0") as HTMLElement;
    const recursosMobile = within(overlay).getByRole("link", {
      name: "Recursos",
    });
    fireEvent.click(recursosMobile);

    expect(document.querySelector("div.fixed.inset-0")).not.toBeInTheDocument();
  });
});
