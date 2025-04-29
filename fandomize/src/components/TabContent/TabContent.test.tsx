// __tests__/TabContent.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import TabContent from "@/components/TabContent/TabContent";
import { useTransform } from "@/contexts/TransformContext";
import { editImageAction } from "@/actions/edit-image.actions";

// ─── mocks ───────────────────────────────────────────────────────────────
jest.mock("@/contexts/TransformContext", () => ({ useTransform: jest.fn() }));

jest.mock("@/components/SelectImage/SelectImage", () => {
  const MockSelectImage = () => (
    <input data-testid="select-image" type="file" />
  );
  MockSelectImage.displayName = "MockSelectImage";
  return MockSelectImage;
});

jest.mock("@/components/StyleSelection/StyleSelection", () => {
  const MockStyleSelection = () => <div data-testid="style-selection" />;
  MockStyleSelection.displayName = "MockStyleSelection";
  return MockStyleSelection;
});

jest.mock("@/components/AdditionalInfo/AdditionalInfo", () => {
  const MockAdditionalInfo = () => <textarea data-testid="additional-info" />;
  MockAdditionalInfo.displayName = "MockAdditionalInfo";
  return MockAdditionalInfo;
});

jest.mock("@/components/SummaryStep/SummaryStep", () => {
  const MockSummaryStep = () => <div data-testid="summary-step" />;
  MockSummaryStep.displayName = "MockSummaryStep";
  return MockSummaryStep;
});

const push = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

jest.mock("@/actions/edit-image.actions");

const makeFile = () => new File(["x"], "test.png", { type: "image/png" });

// ─── helpers ─────────────────────────────────────────────────────────────
const defaultCtx = {
  uploadedImage: null,
  imageStyle: "",
  additionalDetails: "",
};

const renderTab = (tab: number, overrides = {}) => {
  (useTransform as jest.Mock).mockReturnValue({ ...defaultCtx, ...overrides });
  const setActiveTab = jest.fn();
  const setLoading = jest.fn();
  render(
    <TabContent
      activeTab={tab}
      setActiveTab={setActiveTab}
      setLoading={setLoading}
    />,
  );
  return { setActiveTab, setLoading };
};

// ─── testes ──────────────────────────────────────────────────────────────
describe("TabContent – fluxo completo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("Step 0: SelectImage visível; botões off", () => {
    renderTab(0);
    expect(screen.getByTestId("select-image")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /continuar/i })).toBeDisabled();
  });

  it("Step 0 completo → avança para 1", () => {
    const { setActiveTab } = renderTab(0, { uploadedImage: makeFile() });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  it("Step 1: StyleSelection visível; back on, continuar off", () => {
    const { setActiveTab } = renderTab(1);
    expect(screen.getByTestId("style-selection")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(setActiveTab).toHaveBeenCalledWith(0);
  });

  it("Step 1 completo → avança para 2", () => {
    const { setActiveTab } = renderTab(1, { imageStyle: "cyberpunk" });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(setActiveTab).toHaveBeenCalledWith(2);
  });

  it("Step 2: AdditionalInfo presente; enviar off", () => {
    renderTab(2);
    expect(screen.getByTestId("additional-info")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continuar/i })).toBeDisabled();
  });

  it("Step 2 completo → avança para 3", () => {
    const { setActiveTab } = renderTab(2, { additionalDetails: "ok" });
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(setActiveTab).toHaveBeenCalledWith(3);
  });

  it("Step 3: Enviar sem imagem exibe erro na tela", async () => {
    renderTab(3, { imageStyle: "neo", additionalDetails: "ok" });
    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /enviar/i })),
    );
    expect(
      screen.getByText(/Selecione uma imagem antes de enviar/i),
    ).toBeInTheDocument();
    expect(localStorage.getItem("errorMsg")).toBeNull();
  });

  it("Step 3: erro vindo do back-end grava localStorage", async () => {
    (editImageAction as jest.Mock).mockResolvedValueOnce({
      error: "security",
    });
    renderTab(3, {
      uploadedImage: makeFile(),
      imageStyle: "neo",
      additionalDetails: "ok",
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /enviar/i })),
    );

    expect(localStorage.getItem("errorMsg")).toMatch(
      /Parece que a sua solicitação/i,
    );
  });

  it("Fluxo feliz: push para /resultado", async () => {
    (editImageAction as jest.Mock).mockResolvedValueOnce(
      "data:image/png;base64,AAA",
    );
    const { setLoading } = renderTab(3, {
      uploadedImage: makeFile(),
      imageStyle: "neo",
      additionalDetails: "ok",
    });

    await act(async () =>
      fireEvent.click(screen.getByRole("button", { name: /enviar/i })),
    );

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(push).toHaveBeenCalledWith("/resultado");
  });
});
