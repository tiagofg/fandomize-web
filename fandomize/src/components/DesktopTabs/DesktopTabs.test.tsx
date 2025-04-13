import { render, screen, fireEvent } from '@testing-library/react';
import DesktopTabs from './DesktopTabs';
import '@testing-library/jest-dom/extend-expect';
import { useTransform } from '@/contexts/TransformContext';

// Faz o mock do hook useTransform
jest.mock('@/contexts/TransformContext', () => ({
  useTransform: jest.fn() as jest.Mock,
}));

describe('DesktopTabs Component', () => {
  const tabs = ['Tab A', 'Tab B', 'Tab C'];

  describe('quando o contexto possui valores vazios', () => {
    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue({
        uploadedImage: "",
        imageStyle: "",
        additionalDetails: "",
      });
    });

    test('renderiza os botões corretamente com os estados desabilitados conforme esperado', () => {
      const setActiveTab = jest.fn();
      render(<DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      // Para o índice 0, o botão sempre é habilitado (mesmo sem o checkmark, pois o passo 1 não está completo)
      expect(buttons[0]).not.toBeDisabled();
      expect(buttons[0]).toHaveTextContent('1. Tab A');

      // Para o índice 1, o botão deve estar desabilitado pois isStep1Complete é falso (uploadedImage vazio)
      expect(buttons[1]).toBeDisabled();
      expect(buttons[1]).toHaveTextContent('2. Tab B');

      // Para o índice 2, o botão deve estar desabilitado pois isStep2Complete é falso (imageStyle vazio)
      expect(buttons[2]).toBeDisabled();
      expect(buttons[2]).toHaveTextContent('3. Tab C');
    });

    test('não chama setActiveTab quando botões desabilitados são clicados', () => {
      const setActiveTab = jest.fn();
      render(<DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />);

      const buttons = screen.getAllByRole('button');

      // Tenta clicar nos botões dos índices 1 e 2 (desabilitados)
      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[2]);

      expect(setActiveTab).not.toHaveBeenCalled();
    });

    test('chama setActiveTab quando botão habilitado é clicado', () => {
      const setActiveTab = jest.fn();
      render(<DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />);

      const buttons = screen.getAllByRole('button');

      // O botão do índice 0 está sempre habilitado
      fireEvent.click(buttons[0]);
      expect(setActiveTab).toHaveBeenCalledWith(0);
    });
  });

  describe('quando o contexto possui valores completos', () => {
    const completeContext = {
      uploadedImage: 'image.png',
      imageStyle: 'some-style',
      additionalDetails: 'details',
    };

    beforeEach(() => {
      (useTransform as jest.Mock).mockReturnValue(completeContext);
    });

    test('renderiza os botões com checkmarks e habilitados conforme esperado', () => {
      const setActiveTab = jest.fn();
      render(<DesktopTabs tabs={tabs} activeTab={1} setActiveTab={setActiveTab} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);

      // Para o índice 0, checkmark é exibido se o passo 1 estiver completo (uploadedImage é truthy)
      expect(buttons[0]).toHaveTextContent('1. Tab A ✓');
      expect(buttons[0]).not.toBeDisabled();

      // Para o índice 1, o botão é habilitado (pois uploadedImage existe) e exibe checkmark se o passo 2 estiver completo (imageStyle não é vazio)
      expect(buttons[1]).toHaveTextContent('2. Tab B ✓');
      expect(buttons[1]).not.toBeDisabled();

      // Para o índice 2, o botão é habilitado (pois imageStyle não está vazio) e exibe checkmark se o passo 3 estiver completo (additionalDetails não é vazio)
      expect(buttons[2]).toHaveTextContent('3. Tab C ✓');
      expect(buttons[2]).not.toBeDisabled();
    });

    test('chama setActiveTab quando botões habilitados são clicados', () => {
      const setActiveTab = jest.fn();
      render(<DesktopTabs tabs={tabs} activeTab={1} setActiveTab={setActiveTab} />);

      const buttons = screen.getAllByRole('button');

      // Todos os botões estão habilitados no contexto completo
      fireEvent.click(buttons[0]);
      expect(setActiveTab).toHaveBeenCalledWith(0);

      fireEvent.click(buttons[1]);
      expect(setActiveTab).toHaveBeenCalledWith(1);

      fireEvent.click(buttons[2]);
      expect(setActiveTab).toHaveBeenCalledWith(2);
    });
  });

  test('combina com o snapshot', () => {
    // Para o snapshot, usamos o contexto padrão (valores vazios)
    (useTransform as jest.Mock).mockReturnValue({
      uploadedImage: "",
      imageStyle: "",
      additionalDetails: "",
    });
    const setActiveTab = jest.fn();
    const { asFragment } = render(<DesktopTabs tabs={tabs} activeTab={0} setActiveTab={setActiveTab} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
