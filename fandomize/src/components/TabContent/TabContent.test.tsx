// __tests__/TabContent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TabContent from '@/components/TabContent/TabContent';
import { useTransform } from '@/contexts/TransformContext';

// Mocks
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn(),
}));

jest.mock('@/components/SelectImage/SelectImage', () => {
  const MockSelectImage = () => (
    <input data-testid="select-image" type="file" />
  );

  MockSelectImage.displayName = 'MockSelectImage';

  return MockSelectImage;
});

jest.mock('@/components/StyleSelection/StyleSelection', () => {
  const MockStyleSelection = () => (
    <div data-testid="style-selection">StyleSelection</div>
  );

  MockStyleSelection.displayName = 'MockStyleSelection';
  
  return MockStyleSelection;
});

describe('TabContent Component', () => {
  const setActiveTab = jest.fn();
  const defaultContext = {
    uploadedImage: null,
    imageStyle: '',
    additionalDetails: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransform as jest.Mock).mockReturnValue(defaultContext);
  });

  it('Step 0: shows SelectImage and disables buttons', () => {
    render(<TabContent activeTab={0} setActiveTab={setActiveTab} />);

    expect(screen.getByTestId('select-image')).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: 'Voltar' });
    const contBtn = screen.getByRole('button', { name: 'Continuar' });
    expect(backBtn).toBeDisabled();
    expect(contBtn).toBeDisabled();
  });

  it('Step 0 complete: Continue enabled and advances to next tab', () => {
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultContext,
      uploadedImage: new File([''], 'test.png', { type: 'image/png' }),
    });
    render(<TabContent activeTab={0} setActiveTab={setActiveTab} />);

    const contBtn = screen.getByRole('button', { name: 'Continuar' });
    expect(contBtn).toBeEnabled();
    fireEvent.click(contBtn);
    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  it('Step 1: shows StyleSelection and back enabled, continue disabled', () => {
    render(<TabContent activeTab={1} setActiveTab={setActiveTab} />);

    expect(screen.getByTestId('style-selection')).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: 'Voltar' });
    const contBtn = screen.getByRole('button', { name: 'Continuar' });
    expect(backBtn).toBeEnabled();
    expect(contBtn).toBeDisabled();

    fireEvent.click(backBtn);
    expect(setActiveTab).toHaveBeenCalledWith(0);
  });

  it('Step 1 complete: Continue enabled and advances', () => {
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultContext,
      imageStyle: 'some-style',
    });
    render(<TabContent activeTab={1} setActiveTab={setActiveTab} />);

    const contBtn = screen.getByRole('button', { name: 'Continuar' });
    expect(contBtn).toBeEnabled();
    fireEvent.click(contBtn);
    expect(setActiveTab).toHaveBeenCalledWith(2);
  });

  it('Step 2: shows additional comments and buttons state', () => {
    render(<TabContent activeTab={2} setActiveTab={setActiveTab} />);

    expect(screen.getByText('Comentários Adicionais')).toBeInTheDocument();
    const backBtn = screen.getByRole('button', { name: 'Voltar' });
    const finishBtn = screen.getByRole('button', { name: 'Finalizar' });
    expect(backBtn).toBeEnabled();
    expect(finishBtn).toBeDisabled();

    fireEvent.click(backBtn);
    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  it('Step 2 complete: Finalizar enabled and logs completion', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultContext,
      additionalDetails: 'some details',
    });
    render(<TabContent activeTab={2} setActiveTab={setActiveTab} />);

    const finishBtn = screen.getByRole('button', { name: 'Finalizar' });
    expect(finishBtn).toBeEnabled();
    fireEvent.click(finishBtn);
    expect(consoleSpy).toHaveBeenCalledWith('Processo finalizado!');
    consoleSpy.mockRestore();
  });
});
