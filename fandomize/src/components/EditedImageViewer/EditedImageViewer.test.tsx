/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditedImageViewer from "./EditedImageViewer";
import { useRouter } from "next/navigation";

// Mock Next.js Image to render a plain <img>
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt, ...props }: React.ComponentProps<"img">) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("EditedImageViewer Component", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exibe mensagem quando não há imagem gerada", () => {
    render(<EditedImageViewer />);
    expect(
      screen.getByText("Nenhuma imagem gerada encontrada."),
    ).toBeInTheDocument();
  });

  it("renderiza a imagem e botões quando base64 existe", () => {
    localStorage.setItem("editedImageBase64", "ABC123");
    render(<EditedImageViewer />);

    const img = screen.getByAltText("Imagem editada") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("data:image/png;base64,ABC123");

    expect(
      screen.getByRole("button", { name: "Baixar Agora" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Criar Mais" }),
    ).toBeInTheDocument();
  });

  it('baixa a imagem ao clicar em "Baixar Agora"', () => {
    localStorage.setItem("editedImageBase64", "ABC123");
    render(<EditedImageViewer />);

    // Espia appendChild, removeChild e click do <a>
    const appendSpy = jest.spyOn(document.body, "appendChild");
    const removeSpy = jest.spyOn(document.body, "removeChild");
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    // Clica no botão de download
    fireEvent.click(screen.getByRole("button", { name: "Baixar Agora" }));

    // Verifica que appendChild foi chamado com um elemento <a>
    expect(appendSpy).toHaveBeenCalled();
    const anchor = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(anchor.tagName).toBe("A");

    // Verifica href e download
    expect(anchor.href).toBe("data:image/png;base64,ABC123");
    expect(anchor.download).toMatch(
      /^fandomize-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.png$/,
    );

    // click e removeChild
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith(anchor);
  });

  it('navega ao clicar em "Criar Mais"', () => {
    localStorage.setItem("editedImageBase64", "ABC123");
    render(<EditedImageViewer />);

    fireEvent.click(screen.getByRole("button", { name: "Criar Mais" }));
    expect(pushMock).toHaveBeenCalledWith("/transformar");
  });
});
