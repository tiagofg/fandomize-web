// __tests__/StyleCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import StyleCard, { StyleCardProps } from '@/components/StyleCard/StyleCard';
import { useTransform } from '@/contexts/TransformContext';

// Mock useTransform
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn(),
}));

// Mock next/image to a simple <img />
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} {...props} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('StyleCard Component', () => {
  const mockSetImageStyle = jest.fn();
  const mockSetStyleDetails = jest.fn();

  const defaultContext = {
    imageStyle: '',
    setImageStyle: mockSetImageStyle,
    setStyleDetails: mockSetStyleDetails,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransform as jest.Mock).mockReturnValue(defaultContext);
  });

  const props: StyleCardProps = {
    name: 'Test Style',
    value: 'test-style',
    image: '/test-path/test.png',
    hover: 'Test hover message',
  };

  it('renders image and name with correct attributes', () => {
    render(<StyleCard {...props} />);

    // Button with role and partial accessible name
    const button = screen.getByRole('button', { name: /Test Style/ });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', props.hover);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    // Image with alt and src
    const img = screen.getByAltText(props.name);
    expect(img).toHaveAttribute('src', props.image);

    // Name displayed
    expect(screen.getByText(props.name)).toBeInTheDocument();
  });

  it('calls setImageStyle and setStyleDetails on click', () => {
    render(<StyleCard {...props} />);
    const button = screen.getByRole('button', { name: /Test Style/ });
    fireEvent.click(button);
    expect(mockSetImageStyle).toHaveBeenCalledWith(props.value);
    expect(mockSetStyleDetails).toHaveBeenCalledWith(props.hover);
  });

  it('applies selected styles when selected', () => {
    // Mock selected context
    (useTransform as jest.Mock).mockReturnValue({
      imageStyle: props.value,
      setImageStyle: mockSetImageStyle,
      setStyleDetails: mockSetStyleDetails,
    });
    render(<StyleCard {...props} />);

    const button = screen.getByRole('button', { name: /Test Style/ });
    // aria-pressed true
    expect(button).toHaveAttribute('aria-pressed', 'true');
    // Selected classes
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('shadow-xl');

    const span = screen.getByText(props.name);
    expect(span).toHaveClass('text-yellow-300');
  });
});
