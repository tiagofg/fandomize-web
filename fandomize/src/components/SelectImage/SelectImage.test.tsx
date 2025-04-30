// __tests__/SelectImage.test.tsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectImage from "./SelectImage";
import { useTransform } from "@/contexts/TransformContext";
import { compressImageFile } from "@/lib/utils";

// Mocks de contexto e utilitário
jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));
jest.mock("@/lib/utils", () => ({
  compressImageFile: jest.fn(),
}));

// Mock de URL.createObjectURL / revokeObjectURL
const MOCK_URL = "blob://preview-url";
global.URL.createObjectURL = jest.fn(() => MOCK_URL);
global.URL.revokeObjectURL = jest.fn();

describe("SelectImage Component", () => {
  let setUploadedImage: jest.Mock;

  beforeEach(() => {
    setUploadedImage = jest.fn();
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: null,
      setUploadedImage,
    });
    jest.clearAllMocks();
  });

  // ... outros testes mantidos iguais ...

  it("usa compressImageFile para arquivos maiores que 4MB e mostra spinner", async () => {
    // Cria arquivo > 4MB
    const bigFile = new File(["a".repeat(5 * 1024 * 1024)], "big.png", {
      type: "image/png",
    });
    Object.defineProperty(bigFile, "size", {
      value: 5 * 1024 * 1024,
    });

    // Promise pendente para controlar quando comprimir
    let resolveCompression!: (file: File) => void;
    const compressedFile = new File(["small"], "small.png", {
      type: "image/png",
    });
    (compressImageFile as jest.Mock).mockImplementation(
      () =>
        new Promise<File>((res) => {
          resolveCompression = res;
        }),
    );

    const { rerender } = render(<SelectImage />);
    const label = screen
      .getByText(/Clique ou arraste aqui para iniciar a metamorfose!/i)
      .closest("label")!;
    const input = label.querySelector('input[type="file"]')!;

    // dispara o upload
    fireEvent.change(input, { target: { files: [bigFile] } });

    // Spinner deve aparecer enquanto a promise não resolve
    expect(await screen.findByText(/Comprimindo\.\.\./i)).toBeInTheDocument();

    // Agora resolvemos a compressão
    act(() => {
      resolveCompression(compressedFile);
    });

    // Após compressão, deve chamar setUploadedImage com o arquivo comprimido
    await waitFor(() =>
      expect(setUploadedImage).toHaveBeenCalledWith(compressedFile),
    );

    // Simula re-render com contexto atualizado
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: compressedFile,
      setUploadedImage,
    });
    rerender(<SelectImage />);

    // Preview deve aparecer
    await waitFor(() =>
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(compressedFile),
    );
    expect(screen.getByAltText(/Preview da imagem/i)).toBeInTheDocument();
  });
});
