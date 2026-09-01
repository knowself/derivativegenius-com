/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeaturedCarousel } from '../FeaturedCarousel';

const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    jest.fn(),
    {
      scrollPrev: mockScrollPrev,
      scrollNext: mockScrollNext,
    },
  ],
}));

describe('FeaturedCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders large ornate left and right navigation buttons with accessible labels', () => {
    render(<FeaturedCarousel />);

    const prevButton = screen.getByRole('button', { name: /previous portfolio project/i });
    const nextButton = screen.getByRole('button', { name: /next portfolio project/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('triggers scrollPrev when clicking previous button', () => {
    render(<FeaturedCarousel />);

    const prevButton = screen.getByRole('button', { name: /previous portfolio project/i });
    fireEvent.click(prevButton);

    expect(mockScrollPrev).toHaveBeenCalledTimes(1);
  });

  it('triggers scrollNext when clicking next button', () => {
    render(<FeaturedCarousel />);

    const nextButton = screen.getByRole('button', { name: /next portfolio project/i });
    fireEvent.click(nextButton);

    expect(mockScrollNext).toHaveBeenCalledTimes(1);
  });

  it('links portfolio pictures to their respective Centurions Portfolio pages', () => {
    render(<FeaturedCarousel />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', expect.stringMatching(/^\/portfolio\/[a-zA-Z0-9_-]+$/));
    });
  });
});
