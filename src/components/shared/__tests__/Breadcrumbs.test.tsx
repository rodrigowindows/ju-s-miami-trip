import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Breadcrumbs", () => {
  it("renders all crumb labels", () => {
    renderWithRouter(
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Produtos", href: "/produtos" }, { label: "Detalhes" }]} />
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Detalhes")).toBeInTheDocument();
  });

  it("renders links for crumbs with href", () => {
    renderWithRouter(
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Current" }]} />
    );
    const link = screen.getByText("Home").closest("a");
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders last crumb without link", () => {
    renderWithRouter(
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Current" }]} />
    );
    const lastCrumb = screen.getByText("Current");
    expect(lastCrumb.closest("a")).toBeNull();
    expect(lastCrumb).toHaveClass("font-medium");
  });

  it("renders single item without separator", () => {
    renderWithRouter(<Breadcrumbs items={[{ label: "Home" }]} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders empty items without crashing", () => {
    renderWithRouter(<Breadcrumbs items={[]} />);
    expect(screen.queryByRole("navigation")).toBeInTheDocument();
  });
});
