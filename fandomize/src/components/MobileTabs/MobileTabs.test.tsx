/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MobileTabs from "./MobileTabs";
import { useTransform } from "@/contexts/TransformContext";

jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));

describe("MobileTabs Component", () => {
  const tabs = [
    { mobile: "Tab A", desktop: "Tab A" },
    { mobile: "Tab B", desktop: "Tab B" },
    { mobile: "Tab C", desktop: "Tab C" },
  ];

  describe("contexto vazio (nenhum passo completo)", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "",
        imageStyle: "",
        additionalDetails: "",
      });
    });

    it("índice 0 habilitado sem ✓; índices 1 e 2 desabilitados sem ✓", () => {
      render(<MobileTabs tabs={tabs} activeTab={0} setActiveTab={jest.fn()} />);
      const [b0, b1, b2] = screen.getAllByRole("button");

      expect(b0).not.toBeDisabled();
      expect(b0).toHaveTextContent("1. Tab A");
      expect(b0).not.toHaveTextContent("✓");

      expect(b1).toBeDisabled();
      expect(b1).toHaveTextContent("2. Tab B");

      expect(b2).toBeDisabled();
      expect(b2).toHaveTextContent("3. Tab C");
    });

    it("não chama setActiveTab ao clicar em botões desabilitados", () => {
      const setter = jest.fn();
      render(<MobileTabs tabs={tabs} activeTab={0} setActiveTab={setter} />);
      const [, b1, b2] = screen.getAllByRole("button");

      fireEvent.click(b1);
      fireEvent.click(b2);
      expect(setter).not.toHaveBeenCalled();
    });

    it("chama setActiveTab ao clicar no índice 0", () => {
      const setter = jest.fn();
      render(<MobileTabs tabs={tabs} activeTab={0} setActiveTab={setter} />);
      const [b0] = screen.getAllByRole("button");

      fireEvent.click(b0);
      expect(setter).toHaveBeenCalledWith(0);
    });
  });

  describe("somente passo 1 completo (uploadedImage)", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "",
        additionalDetails: "",
      });
    });

    it("1. mostra ✓ no botão 0; 2. índice 1 habilitado sem ✓; 3. índice 2 ainda desabilitado", () => {
      render(<MobileTabs tabs={tabs} activeTab={0} setActiveTab={jest.fn()} />);
      const [b0, b1, b2] = screen.getAllByRole("button");

      expect(b0).toHaveTextContent("1. Tab A ✓");
      expect(b0).not.toBeDisabled();

      expect(b1).toHaveTextContent("2. Tab B");
      expect(b1).not.toBeDisabled();
      expect(b1).not.toHaveTextContent("✓");

      expect(b2).toBeDisabled();
      expect(b2).toHaveTextContent("3. Tab C");
    });
  });

  describe("passos 1 e 2 completos (uploadedImage + imageStyle)", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "estilo",
        additionalDetails: "",
      });
    });

    it("1. e 2. com ✓ e habilitados; 3. habilitado sem ✓", () => {
      render(<MobileTabs tabs={tabs} activeTab={1} setActiveTab={jest.fn()} />);
      const [b0, b1, b2] = screen.getAllByRole("button");

      expect(b0).toHaveTextContent("1. Tab A ✓");
      expect(b0).not.toBeDisabled();

      expect(b1).toHaveTextContent("2. Tab B ✓");
      expect(b1).not.toBeDisabled();

      expect(b2).toHaveTextContent("3. Tab C");
      expect(b2).not.toBeDisabled();
      expect(b2).not.toHaveTextContent("✓");
    });
  });

  describe("todos os passos completos", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "estilo",
        additionalDetails: "detalhes",
      });
    });

    it("todos os botões habilitados e com ✓", () => {
      render(<MobileTabs tabs={tabs} activeTab={2} setActiveTab={jest.fn()} />);
      const [b0, b1, b2] = screen.getAllByRole("button");

      [b0, b1, b2].forEach((btn, idx) => {
        expect(btn).not.toBeDisabled();
        expect(btn).toHaveTextContent(
          `${idx + 1}. Tab ${String.fromCharCode(65 + idx)} ✓`,
        );
      });
    });

    it("dispara setActiveTab ao clicar em qualquer botão", () => {
      const setter = jest.fn();
      render(<MobileTabs tabs={tabs} activeTab={0} setActiveTab={setter} />);
      screen.getAllByRole("button").forEach((btn, idx) => {
        fireEvent.click(btn);
        expect(setter).toHaveBeenCalledWith(idx);
      });
    });
  });

  it("aplica classe de ativo corretamente e snapshot do estado vazio", () => {
    // Testa snapshot e classe de activeTab
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: "",
      imageStyle: "",
      additionalDetails: "",
    });
    const setter = jest.fn();
    const { asFragment } = render(
      <MobileTabs tabs={tabs} activeTab={1} setActiveTab={setter} />,
    );
    const [, activeBtn] = screen.getAllByRole("button");

    expect(activeBtn).toHaveClass("border-b-2", "text-[#FDCB6E]");
    expect(asFragment()).toMatchSnapshot();
  });
});
