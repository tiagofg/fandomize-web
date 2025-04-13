import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectImage from './SelectImage';
import '@testing-library/jest-dom/extend-expect';
import { useTransform } from '@/contexts/TransformContext';

// Mock do hook useTransform
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn() as jest.Mock,
}));

// Mock de URL.createObjectURL / revokeObjectURL
const MOCK_URL = 'blob://preview-url';
global.URL.createObjectURL = jest.fn(() => MOCK_URL);
global.URL.revokeObjectURL = jest.fn();

describe('SelectImage Component', () => {
  let setUploadedImage: jest.Mock;

  beforeEach(() => {
    setUploadedImage = jest.fn();
    // Por padrão, sem imagem
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: null,
      setUploadedImage,
    });
    jest.clearAllMocks();
  });

  test('renderiza área de upload quando não há preview', () => {
    render(<SelectImage />);
    // Deve exibir o texto de instrução
    expect(
      screen.getByText(/Clique ou arraste uma imagem para começar a transformação!/i)
    ).toBeInTheDocument();
    // Não deve haver elemento <img> de preview
    expect(screen.queryByAltText(/Preview da imagem/i)).toBeNull();
  });

  test('faz upload via input e exibe preview', async () => {
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    const { container, rerender } = render(<SelectImage />);

    // Seleciona diretamente o input[type=file]
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
    }
    expect(setUploadedImage).toHaveBeenCalledWith(file);

    // Agora simula contexto atualizado e re-renderiza
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: file,
      setUploadedImage,
    });
    rerender(<SelectImage />);

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
    const img = screen.getByAltText(/Preview da imagem/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining(MOCK_URL));
  });

  test('faz upload via drag & drop e exibe preview', async () => {
    const file = new File(['dummy'], 'photo2.jpg', { type: 'image/jpeg' });
    const label = render(<SelectImage />).container.querySelector('label');

    // Simula drag over
    if (label) {
      fireEvent.dragOver(label);
    }
    expect(label).toHaveClass('border-blue-400');

    // Simula drop
    if (label) {
      fireEvent.drop(label, {
        dataTransfer: { files: [file] },
      });
    }
    expect(setUploadedImage).toHaveBeenCalledWith(file);

    // Re-render com o contexto atualizado
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: file,
      setUploadedImage,
    });
    // força re-render para disparar useEffect
    render(<SelectImage />);

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
    expect(screen.getByAltText(/Preview da imagem/i)).toBeInTheDocument();
  });

  test('remove a imagem ao clicar no botão de remoção', async () => {
    const file = new File(['x'], 'pic.png', { type: 'image/png' });

    // 1. Mocka o contexto com imagem
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: file,
      setUploadedImage,
    });

    // 2. Renderiza e aguarda o preview
    const { rerender } = render(<SelectImage />);
    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
    expect(screen.getByAltText(/Preview da imagem/i)).toBeInTheDocument();

    // 3. Clica em remover
    const removeBtn = screen.getByTitle('Remover imagem');
    fireEvent.click(removeBtn);
    expect(setUploadedImage).toHaveBeenCalledWith(null);

    // 4. Atualiza o mock do contexto para sem imagem e re-renderiza
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: null,
      setUploadedImage,
    });
    rerender(<SelectImage />);

    // 5. Agora o preview deve ter sumido
    expect(screen.queryByAltText(/Preview da imagem/i)).toBeNull();
  });
});
