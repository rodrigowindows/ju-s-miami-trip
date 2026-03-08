import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "@/components/shared/EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="Nenhum produto encontrado" />);
    expect(screen.getByText("Nenhum produto encontrado")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="Vazio" description="Tente novamente" />);
    expect(screen.getByText("Tente novamente")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="Vazio" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("renders children when provided", () => {
    render(
      <EmptyState title="Vazio">
        <button>Ação</button>
      </EmptyState>
    );
    expect(screen.getByText("Ação")).toBeInTheDocument();
  });
});
