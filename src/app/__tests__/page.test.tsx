/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage Component", () => {
  it("renders the main heading for Derivative Genius", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Build Intelligent Web Apps/i);
  });

  it("renders the CTA link to contact page", () => {
    render(<HomePage />);
    const ctas = screen.getAllByRole("link", { name: /Start Your Web Project/i });
    expect(ctas[0]).toBeInTheDocument();
    expect(ctas[0]).toHaveAttribute("href", "/contact");
  });
});
