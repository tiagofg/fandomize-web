import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import CategorySection, { CategorySectionProps } from '@/components/CategorySection/CategorySection';
import { useTransform } from '@/contexts/TransformContext';

jest.mock('@/components/StyleCard/StyleCard', () => {
  const MockStyleCard = (props: { name: string; value: string; image: string; hover: string }) => {
    const { name, value, image, hover } = props;

    return (
      <div
        data-testid="style-card"
        data-name={name}
        data-value={value}
        data-image={image}
        data-hover={hover}
      />
    );
  };

  MockStyleCard.displayName = 'MockStyleCard';

  return MockStyleCard;
});

jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn(),
}));

const defaultItems = [
  { name: 'Item1', value: 'item-1', image: 'item1.png', hover: 'Hover1' },
  { name: 'Item2', value: 'item-2', image: 'item2.png', hover: 'Hover2' },
];

function renderComponent(props: Partial<CategorySectionProps> = {}) {
  const defaultProps: CategorySectionProps = {
    title: 'Test Section',
    items: defaultItems,
    path: '/test-path',
  };
  return render(<CategorySection {...defaultProps} {...props} />);
}

describe('CategorySection', () => {
  beforeEach(() => {
    (useTransform as jest.Mock).mockReturnValue({ imageStyle: '', setImageStyle: jest.fn() });
  });

  it('renders the summary title', () => {
    renderComponent();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders all StyleCard components with correct props', () => {
    renderComponent();
    const cards = screen.getAllByTestId('style-card');
    expect(cards).toHaveLength(defaultItems.length);

    defaultItems.forEach(item => {
      const cards = screen.getAllByTestId('style-card');
      const card = cards.find(card => card.getAttribute('data-value') === item.value);

      expect(card).toBeDefined();
      expect(card).toHaveAttribute('data-name', item.name);
      expect(card).toHaveAttribute('data-image', `/test-path/${item.image}`);
      expect(card).toHaveAttribute('data-hover', item.hover);
    });
  });

  it('opens details by default on desktop', async () => {
    global.innerWidth = 1024;

    const { container } = renderComponent();

    await waitFor(() => {
      const details = container.querySelector('details');
      expect(details).toHaveAttribute('open');
    });
  });

  it('keeps details closed by default on mobile when no selection', async () => {
    global.innerWidth = 500;

    const { container } = renderComponent();

    await waitFor(() => {
      const details = container.querySelector('details');
      expect(details).not.toHaveAttribute('open');
    });
  });

  it('opens details on mobile when the selected imageStyle matches an item', async () => {
    global.innerWidth = 500;

    (useTransform as jest.Mock).mockReturnValue({ imageStyle: 'item-2', setImageStyle: jest.fn() });
    const { container } = renderComponent();

    await waitFor(() => {
      const details = container.querySelector('details');
      expect(details).toHaveAttribute('open');
    });
  });
});
