import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import '@testing-library/jest-dom/extend-expect';

describe('Header Component', () => {
  test('renderiza o header com a estrutura correta', () => {
    render(<Header />);
    
    // Verifica se o elemento header está presente na página
    const headerElement = document.querySelector('header');
    expect(headerElement).toBeInTheDocument();
    
    // Verifica se a imagem com o alt "Logo Fandomize" está presente
    const imageElement = screen.getByAltText('Logo Fandomize');
    expect(imageElement).toBeInTheDocument();
    
    // Confirma que o link da logo aponta para a rota "/"
    const logoLink = imageElement.closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
    
    // Verifica a presença dos links do menu
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
    
    // Verifica se o header possui as classes esperadas
    expect(headerElement).toHaveClass('w-full');
    expect(headerElement).toHaveClass('p-4');
    expect(headerElement).toHaveClass('flex');
    expect(headerElement).toHaveClass('items-center');
    expect(headerElement).toHaveClass('justify-between');
    expect(headerElement).toHaveClass('text-white');
    expect(headerElement).toHaveClass('bg-white/40');
    expect(headerElement).toHaveClass('backdrop-blur-lg');
    expect(headerElement).toHaveClass('shadow-lg');
  });

  test('combina com o snapshot', () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
