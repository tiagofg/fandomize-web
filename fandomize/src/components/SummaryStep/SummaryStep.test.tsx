/**
 * @jest-environment jsdom
 */
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import SummaryStep from "./SummaryStep";
import { useTransform } from "@/contexts/TransformContext";

// Mocks
jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src as string} alt={alt} {...props} />
  ),
}));

describe("SummaryStep Component", () => {
  const mockUseTransform = useTransform as jest.Mock;

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("exibe fallback correto quando não há imagem e detalhes vazios", () => {
    mockUseTransform.mockReturnValue({
      uploadedImage: null,
      imageStyle: "",
      styleDetails: "",
      additionalDetails: "",
    });
    render(<SummaryStep />);

    // Preview fallback
    expect(screen.getByText("Nenhuma imagem selecionada")).toBeInTheDocument();

    // Estilo: "()" por causa do template
    const styleText = screen.getByText(/\(\)/);
    expect(styleText).toBeInTheDocument();

    // Detalhes extras fallback
    expect(screen.getByText("Nenhum detalhe adicional")).toBeInTheDocument();
  });

  it("renderiza preview, estilo e detalhes quando fornecidos", () => {
    const file = new File(["data"], "test.png", { type: "image/png" });
    const previewUrl = "blob://preview";
    const mockedCreate = jest.fn().mockReturnValue(previewUrl);
    const mockedRevoke = jest.fn();
    // Atribui diretamente em URL
    global.URL.createObjectURL = mockedCreate;
    global.URL.revokeObjectURL = mockedRevoke;

    mockUseTransform.mockReturnValue({
      uploadedImage: file,
      imageStyle: "gta",
      styleDetails: "urban style",
      additionalDetails: "epic detail",
    });

    const { unmount } = render(<SummaryStep />);

    // createObjectURL chamado
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);

    // Imagem de preview
    const img = screen.getByAltText("Preview") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(previewUrl);

    // Texto de estilo
    expect(screen.getByText("gta (urban style)")).toBeInTheDocument();

    // Texto de detalhes
    expect(screen.getByText("epic detail")).toBeInTheDocument();

    // cleanup chama revokeObjectURL
    unmount();
    expect(mockedRevoke).toHaveBeenCalledWith(previewUrl);
  });
});
