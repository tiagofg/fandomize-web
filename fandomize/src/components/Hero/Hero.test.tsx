import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import '@testing-library/jest-dom/extend-expect';

describe('Hero Component', () => {
  test('renderiza o hero com título, descrição e link corretos', () => {
    render(<Hero />);

    // Verifica se o título (h2) está presente com o texto esperado
    const titleElement = screen.getByRole('heading', {
      level: 2,
      name: 'Sua imagem, seu fandom, seu estilo!'
    });
    expect(titleElement).toBeInTheDocument();

    // Verifica se a descrição está renderizada (usa uma parte do texto para evitar problemas com espaçamento)
    const descriptionRegex = /Transforme fotos comuns em universos extraordinários/i;
    const descriptionElement = screen.getByText(descriptionRegex);
    expect(descriptionElement).toBeInTheDocument();

    // Verifica se o link "Transforme Agora" está presente e aponta para a rota correta
    const linkElement = screen.getByRole('link', { name: 'Transforme Agora' });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/transformar');
  });

  test('o elemento section possui as classes CSS corretas', () => {
    const { container } = render(<Hero />);
    const sectionElement = container.querySelector('section');

    // Verifica se a section possui as classes definidas no componente
    expect(sectionElement).toHaveClass('w-full');
    expect(sectionElement).toHaveClass('flex');
    expect(sectionElement).toHaveClass('flex-col');
    expect(sectionElement).toHaveClass('items-center');
    expect(sectionElement).toHaveClass('justify-center');
    expect(sectionElement).toHaveClass('text-center');
    expect(sectionElement).toHaveClass('h-100%');
    expect(sectionElement).toHaveClass('py-20');
    expect(sectionElement).toHaveClass('px-4');
    expect(sectionElement).toHaveClass('text-white');
  });

  test('combina com o snapshot', () => {
    const { asFragment } = render(<Hero />);
    expect(asFragment()).toMatchSnapshot();
  });
});
