import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import '@testing-library/jest-dom/extend-expect';

describe('Footer Component', () => {
  test('renderiza o footer com o texto correto e o ano atual', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    // Expressão regular para encontrar o texto contendo o símbolo ©, o ano e a mensagem esperada.
    const regex = new RegExp(`©\\s*${currentYear}\\s*Fandomize\\. Todos os direitos reservados\\.?`);
    const textElement = screen.getByText(regex);
    expect(textElement).toBeInTheDocument();
  });

  test('o elemento footer possui as classes CSS corretas', () => {
    const { container } = render(<Footer />);
    const footerElement = container.querySelector('footer');

    // Verifica se o elemento footer possui as classes definidas
    expect(footerElement).toHaveClass('w-full');
    expect(footerElement).toHaveClass('p-4');
    expect(footerElement).toHaveClass('text-white');
    expect(footerElement).toHaveClass('text-center');
    expect(footerElement).toHaveClass('bg-white/40');
    expect(footerElement).toHaveClass('backdrop-blur-lg');
    expect(footerElement).toHaveClass('shadow-lg');
  });

  test('combina com o snapshot', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
