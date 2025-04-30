/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdditionalInfo from "./AdditionalInfo";
import { useTransform } from "@/contexts/TransformContext";

jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));

describe("AdditionalInfo Component", () => {
  let setAdditionalDetails: jest.Mock;

  beforeEach(() => {
    setAdditionalDetails = jest.fn();
    (useTransform as jest.Mock).mockReturnValue({
      additionalDetails: "",
      setAdditionalDetails,
    });
    jest.clearAllMocks();
  });

  it("renderiza título, descrição e textarea com placeholder", () => {
    render(<AdditionalInfo />);

    // Título
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Dê um boost nos detalhes",
      }),
    ).toBeInTheDocument();

    // Descrição
    expect(
      screen.getByText(
        /Conte como quer o cenário, as roupas ou qualquer detalhe épico/i,
      ),
    ).toBeInTheDocument();

    // Textarea com placeholder correto
    const textarea = screen.getByPlaceholderText(
      "Ex: Fundo com montanhas ao pôr do sol, roupa estilo vitoriano...",
    );
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("w-full", "h-32", "resize-y");
  });

  it("exibe o valor inicial de additionalDetails no textarea", () => {
    // Mocka contexto com valor inicial
    (useTransform as jest.Mock).mockReturnValue({
      additionalDetails: "Cenário dramático à meia-noite",
      setAdditionalDetails,
    });

    render(<AdditionalInfo />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Cenário dramático à meia-noite");
  });

  it("chama setAdditionalDetails ao digitar na textarea", () => {
    render(<AdditionalInfo />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "Luz suave e névoa" } });
    expect(setAdditionalDetails).toHaveBeenCalledWith("Luz suave e névoa");
  });

  it("mantém classes de foco corretas na textarea", () => {
    render(<AdditionalInfo />);
    const textarea = screen.getByRole("textbox");

    // Simula foco para verificar classe de ring
    fireEvent.focus(textarea);
    expect(textarea).toHaveClass("focus:ring-2", "focus:ring-yellow-300");
  });
});
