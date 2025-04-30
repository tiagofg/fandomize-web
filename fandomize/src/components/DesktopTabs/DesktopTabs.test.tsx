/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DesktopTabs from "./DesktopTabs";
import { useTransform } from "@/contexts/TransformContext";

jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));

describe("DesktopTabs Component", () => {
  // Agora tabs são objetos com propriedade `desktop`
  const tabs = [
    { desktop: "Tab A", mobile: "Tab A" },
    { desktop: "Tab B", mobile: "Tab B" },
    { desktop: "Tab C", mobile: "Tab C" },
  ];

  describe("quando o contexto possui valores vazios", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "",
        imageStyle: "",
        additionalDetails: "",
      });
    });

    it("renderiza 1 habilitado e 2 desabilitados, sem ✓", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);

      // índice 0 habilitado, sem ✓
      expect(buttons[0]).not.toBeDisabled();
      expect(buttons[0]).toHaveTextContent("1. Tab A");
      expect(buttons[0]).not.toHaveTextContent("✓");

      // índice 1 desabilitado, sem ✓
      expect(buttons[1]).toBeDisabled();
      expect(buttons[1]).toHaveTextContent("2. Tab B");
      expect(buttons[1]).not.toHaveTextContent("✓");

      // índice 2 desabilitado, sem ✓
      expect(buttons[2]).toBeDisabled();
      expect(buttons[2]).toHaveTextContent("3. Tab C");
      expect(buttons[2]).not.toHaveTextContent("✓");
    });

    it("não chama setActiveTab ao clicar em desabilitados", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />,
      );

      const buttons = screen.getAllByRole("button");
      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[2]);
      expect(setActiveTab).not.toHaveBeenCalled();
    });

    it("chama setActiveTab ao clicar em habilitado (índice 0)", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />,
      );

      fireEvent.click(screen.getAllByRole("button")[0]);
      expect(setActiveTab).toHaveBeenCalledWith(0);
    });
  });

  describe("quando apenas a imagem está presente (passo 1 completo)", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "",
        additionalDetails: "",
      });
    });

    it("índice 0 ✓, índice 1 habilitado sem ✓, índice 2 desabilitado", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />,
      );
      const [btn0, btn1, btn2] = screen.getAllByRole("button");

      expect(btn0).not.toBeDisabled();
      expect(btn0).toHaveTextContent("1. Tab A ✓");

      expect(btn1).not.toBeDisabled();
      expect(btn1).toHaveTextContent("2. Tab B");
      expect(btn1).not.toHaveTextContent("✓");

      expect(btn2).toBeDisabled();
      expect(btn2).toHaveTextContent("3. Tab C");
    });
  });

  describe("quando imagem e estilo estão presentes (passos 1 e 2 completos)", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "estilo",
        additionalDetails: "",
      });
    });

    it("índices 0 e 1 ✓, índice 2 habilitado sem ✓", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={1} setActiveTab={setActiveTab} />,
      );
      const [btn0, btn1, btn2] = screen.getAllByRole("button");

      expect(btn0).toHaveTextContent("1. Tab A ✓");
      expect(btn0).not.toBeDisabled();

      expect(btn1).toHaveTextContent("2. Tab B ✓");
      expect(btn1).not.toBeDisabled();

      expect(btn2).toHaveTextContent("3. Tab C");
      expect(btn2).not.toBeDisabled();
      expect(btn2).not.toHaveTextContent("✓");
    });
  });

  describe("quando todos os passos estão completos", () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "img.png",
        imageStyle: "estilo",
        additionalDetails: "detalhes",
      });
    });

    it("renderiza todos habilitados com ✓", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={2} setActiveTab={setActiveTab} />,
      );

      const [btn0, btn1, btn2] = screen.getAllByRole("button");
      expect(btn0).toHaveTextContent("1. Tab A ✓");
      expect(btn1).toHaveTextContent("2. Tab B ✓");
      expect(btn2).toHaveTextContent("3. Tab C ✓");
      expect(btn0).not.toBeDisabled();
      expect(btn1).not.toBeDisabled();
      expect(btn2).not.toBeDisabled();
    });

    it("chama setActiveTab para qualquer botão habilitado", () => {
      const setActiveTab = jest.fn();
      render(
        <DesktopTabs tabs={tabs} activeTab={1} setActiveTab={setActiveTab} />,
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn, idx) => {
        fireEvent.click(btn);
        expect(setActiveTab).toHaveBeenCalledWith(idx);
      });
    });
  });

  it("combina com o snapshot (valores vazios)", () => {
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: "",
      imageStyle: "",
      additionalDetails: "",
    });
    const setActiveTab = jest.fn();
    const { asFragment } = render(
      <DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
