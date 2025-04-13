import { render, screen, fireEvent } from '@testing-library/react';
import TabContent from './TabContent';
import '@testing-library/jest-dom/extend-expect';
import { useTransform } from '@/contexts/TransformContext';

// Mock do hook useTransform
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn(),
}));

// Mock de URL.createObjectURL / revokeObjectURL para SelectImage
const MOCK_URL = 'blob://preview-url';
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => MOCK_URL);
  global.URL.revokeObjectURL = jest.fn();
});

describe('TabContent Component', () => {
  const setActiveTab = jest.fn();
  const defaultMocks = {
    uploadedImage: null,
    imageStyle: '',
    additionalDetails: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTransform as jest.Mock).mockReturnValue(defaultMocks);
  });

  test('etapa 0: mostra SelectImage, botões desabilitados', () => {
    const { container } = render(<TabContent activeTab={0} setActiveTab={setActiveTab} />);

    // Conteúdo: SelectImage renderiza <input type="file">
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    // Botões
    const backBtn = screen.getByText('Voltar');
    const contBtn = screen.getByText('Continuar');
    expect(backBtn).toBeDisabled();
    expect(contBtn).toBeDisabled();
  });

  test('etapa 0 completa: Continue habilitado e avança', () => {
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultMocks,
      uploadedImage: new File([''], 'a.png', { type: 'image/png' }),
    });
    render(<TabContent activeTab={0} setActiveTab={setActiveTab} />);

    const contBtn = screen.getByText('Continuar');
    expect(contBtn).toBeEnabled();
    fireEvent.click(contBtn);
    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  test('etapa 1: mostra título, Continue desabilitado quando vazio', () => {
    render(<TabContent activeTab={1} setActiveTab={setActiveTab} />);
    expect(screen.getByText('Selecione o Estilo')).toBeInTheDocument();

    const backBtn = screen.getByText('Voltar');
    const contBtn = screen.getByText('Continuar');
    expect(backBtn).toBeEnabled();
    expect(contBtn).toBeDisabled();

    fireEvent.click(backBtn);
    expect(setActiveTab).toHaveBeenCalledWith(0);
  });

  test('etapa 1 completa: Continue habilitado e avança', () => {
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultMocks,
      imageStyle: 'foo',
    });
    render(<TabContent activeTab={1} setActiveTab={setActiveTab} />);

    const contBtn = screen.getByText('Continuar');
    expect(contBtn).toBeEnabled();
    fireEvent.click(contBtn);
    expect(setActiveTab).toHaveBeenCalledWith(2);
  });

  test('etapa 2: mostra título, botão Finalizar desabilitado quando vazio', () => {
    render(<TabContent activeTab={2} setActiveTab={setActiveTab} />);
    expect(screen.getByText('Comentários Adicionais')).toBeInTheDocument();

    const backBtn = screen.getByText('Voltar');
    const finishBtn = screen.getByText('Finalizar');
    expect(backBtn).toBeEnabled();
    expect(finishBtn).toBeDisabled();

    fireEvent.click(backBtn);
    expect(setActiveTab).toHaveBeenCalledWith(1);
  });

  test('etapa 2 completa: Finalizar habilitado e chama console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (useTransform as jest.Mock).mockReturnValue({
      ...defaultMocks,
      additionalDetails: 'bar',
    });
    render(<TabContent activeTab={2} setActiveTab={setActiveTab} />);

    const finishBtn = screen.getByText('Finalizar');
    expect(finishBtn).toBeEnabled();
    fireEvent.click(finishBtn);
    expect(spy).toHaveBeenCalledWith('Processo finalizado!');
    spy.mockRestore();
  });
});
