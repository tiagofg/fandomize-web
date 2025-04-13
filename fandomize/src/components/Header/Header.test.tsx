import { render, screen, fireEvent, within } from '@testing-library/react';
import Header from './Header';
import '@testing-library/jest-dom/extend-expect';

describe('Header Component', () => {
  test('renderiza o header com a estrutura correta', () => {
    render(<Header />);
    
    // Verifica se o elemento header está presente na página
    const headerElement = document.querySelector('header');
    expect(headerElement).toBeInTheDocument();

    // Verifica se existem duas imagens com o alt "Logo Fandomize"
    const imageElements = screen.getAllByAltText('Logo Fandomize');
    expect(imageElements.length).toBe(2);

    // Confirma que o link que envolve as imagens aponta para a rota "/"
    const logoLink = imageElements[0].closest('a');
    expect(logoLink).toHaveAttribute('href', '/');

    // Verifica a presença dos links do menu (desktop)
    expect(screen.getByText('Recursos')).toBeInTheDocument();
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();

    // Verifica os atributos href dos links do menu
    const recursosLink = screen.getByText('Recursos').closest('a');
    expect(recursosLink).toHaveAttribute('href', '#features');

    const sobreLink = screen.getByText('Sobre').closest('a');
    expect(sobreLink).toHaveAttribute('href', '#about');

    const contatoLink = screen.getByText('Contato').closest('a');
    expect(contatoLink).toHaveAttribute('href', '#contact');
  });

  test('o elemento header possui as classes CSS corretas', () => {
    const { container } = render(<Header />);
    const headerElement = container.querySelector('header');
    
    expect(headerElement).toHaveClass('w-full');
    expect(headerElement).toHaveClass('p-4');
    expect(headerElement).toHaveClass('flex');
    expect(headerElement).toHaveClass('items-center');
    expect(headerElement).toHaveClass('justify-between');
    expect(headerElement).toHaveClass('text-white');
    expect(headerElement).toHaveClass('bg-white/40');
    expect(headerElement).toHaveClass('shadow-lg');
  });

  test('combina com o snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });

  // Testes adicionais para o menu mobile

  test('não exibe o menu mobile por padrão', () => {
    render(<Header />);
    // O overlay do menu mobile possui as classes 'fixed inset-0'
    const overlay = document.querySelector('div.fixed.inset-0');
    expect(overlay).toBeNull();
  });

  test('exibe o menu mobile ao clicar no botão de toggle', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    
    const overlay = document.querySelector('div.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    // Verifica também se o botão de fechar (dentro do overlay) está presente
    const closeButton = screen.getByLabelText('Close menu');
    expect(closeButton).toBeInTheDocument();
  });

  test('fecha o menu mobile ao clicar no botão de fechar', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);
    
    const overlay = document.querySelector('div.fixed.inset-0');
    expect(overlay).toBeNull();
  });

  test('fecha o menu mobile ao clicar em um link do menu', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    
    // Após abrir o menu mobile, localiza o overlay
    const overlay = document.querySelector('div.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    
    // Usando o within, busca o link "Recursos" que está dentro do overlay
    if (!overlay) {
      throw new Error('Overlay not found');
    }
    const mobileRecursosLink = within(overlay as HTMLElement).getByText('Recursos');
    fireEvent.click(mobileRecursosLink);
    
    // Após o clique, o overlay deve ser fechado
    const overlayAfterClick = document.querySelector('div.fixed.inset-0');
    expect(overlayAfterClick).toBeNull();
  });
});
