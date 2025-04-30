// __tests__/StyleSelection.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import StyleSelection from "@/components/StyleSelection/StyleSelection";
import { useTransform } from "@/contexts/TransformContext";

// Mock useTransform
jest.mock("@/contexts/TransformContext", () => ({
  useTransform: jest.fn(),
}));

// Mock CategorySection para inspecionar títulos
interface MockCategorySectionProps {
  title: string;
}

jest.mock("@/components/CategorySection/CategorySection", () => {
  const MockCategorySection = (props: MockCategorySectionProps) => (
    <div data-testid="category-section" data-title={props.title} />
  );
  MockCategorySection.displayName = "MockCategorySection";
  return MockCategorySection;
});

describe("StyleSelection Component", () => {
  const mockUseTransform = useTransform as jest.Mock;

  beforeEach(() => {
    mockUseTransform.mockReturnValue({
      imageStyle: "",
      styleDetails: "",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o header e a mensagem padrão quando nenhum estilo está selecionado", () => {
    render(<StyleSelection />);

    // Header
    expect(
      screen.getByRole("heading", {
        name: /para qual universo sua foto vai viajar/i,
      }),
    ).toBeInTheDocument();

    // Mensagem padrão
    expect(
      screen.getByText("Nenhum estilo escolhido até o momento"),
    ).toBeInTheDocument();

    // Quatro CategorySection
    const sections = screen.getAllByTestId("category-section");
    expect(sections).toHaveLength(4);

    const titles = sections.map((el) => el.getAttribute("data-title"));
    expect(titles).toEqual(["Animações", "Jogos", "Filmes e séries", "Outros"]);
  });

  it("exibe o estilo e detalhes selecionados quando fornecidos", () => {
    mockUseTransform.mockReturnValue({
      imageStyle: "gta",
      styleDetails: "Estilo urbano com clima de ação e crime.",
    });

    render(<StyleSelection />);

    expect(
      screen.getByText(
        "Estilo escolhido: gta (Estilo urbano com clima de ação e crime.)",
      ),
    ).toBeInTheDocument();
  });
});
