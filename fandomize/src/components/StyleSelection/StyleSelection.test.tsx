// __tests__/StyleSelection.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import StyleSelection from '@/components/StyleSelection/StyleSelection';
import { useTransform } from '@/contexts/TransformContext';

// Mock useTransform
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn(),
}));

// Mock CategorySection to inspect titles
interface MockCategorySectionProps {
  title: string;
}

jest.mock('@/components/CategorySection/CategorySection', () => {
  const MockCategorySection = (props: MockCategorySectionProps) => (
    <div data-testid="category-section" data-title={props.title} />
  );

  MockCategorySection.displayName = 'MockCategorySection';

  return MockCategorySection;
});

describe('StyleSelection Component', () => {
  const mockUseTransform = useTransform as jest.Mock;

  beforeEach(() => {
    mockUseTransform.mockReturnValue({
      imageStyle: '',
      styleDetails: '',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and default message when no style selected', () => {
    render(<StyleSelection />);

    // Header
    expect(
      screen.getByRole('heading', { name: /escolha o universo/i })
    ).toBeInTheDocument();

    // Default message
    expect(
      screen.getByText('Nenhum estilo selecionado até o momento')
    ).toBeInTheDocument();

    // Four category sections
    const sections = screen.getAllByTestId('category-section');
    expect(sections).toHaveLength(4);

    const titles = sections.map(el => el.getAttribute('data-title'));
    expect(titles).toEqual([
      'Animações',
      'Filmes e séries',
      'Jogos',
      'Outros',
    ]);
  });

  it('displays selected style and details when provided', () => {
    mockUseTransform.mockReturnValue({
      imageStyle: 'gta',
      styleDetails: 'Estilo urbano com clima de ação e crime.',
    });

    render(<StyleSelection />);

    expect(
      screen.getByText(
        'Estilo selecionado: gta (Estilo urbano com clima de ação e crime.)'
      )
    ).toBeInTheDocument();
  });
});
