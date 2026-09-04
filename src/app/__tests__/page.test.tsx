/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage Component", () => {
  it("renders the main heading for Derivative Genius", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/That Make Your Phone Ring/i);
  });

  it("renders the CTA link to contact page and direct phone call", () => {
    render(<HomePage />);
    const callCta = screen.getByRole("link", { name: /Call Joe Terry/i });
    expect(callCta).toBeInTheDocument();
    expect(callCta).toHaveAttribute("href", "tel:+13103799822");

    const auditCta = screen.getByRole("link", { name: /Request a Free Website Audit/i });
    expect(auditCta).toBeInTheDocument();
    expect(auditCta).toHaveAttribute("href", "/contact");
  });
});
