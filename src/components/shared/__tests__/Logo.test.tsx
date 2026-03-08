import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/shared/Logo";

describe("Logo", () => {
  it("renders with text by default", () => {
    render(<Logo />);
    expect(screen.getByText("AjuVaiParaMiami")).toBeInTheDocument();
  });

  it("hides text when showText is false", () => {
    render(<Logo showText={false} />);
    expect(screen.queryByText("AjuVaiParaMiami")).not.toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container } = render(<Logo size="lg" />);
    expect(container.firstChild).toBeTruthy();
  });
});
