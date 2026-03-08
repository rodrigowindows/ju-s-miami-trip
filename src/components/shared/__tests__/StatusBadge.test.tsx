import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/shared/StatusBadge";

describe("StatusBadge", () => {
  it("renders correct label for known status", () => {
    render(<StatusBadge status="novo" />);
    expect(screen.getByText("Novo")).toBeInTheDocument();
  });

  it("renders custom label when provided", () => {
    render(<StatusBadge status="novo" customLabel="Custom" />);
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("renders status text for unknown status", () => {
    render(<StatusBadge status="unknown_status" />);
    expect(screen.getByText("unknown_status")).toBeInTheDocument();
  });

  it("renders correct label for order statuses", () => {
    const statuses = [
      { status: "entregue", label: "Entregue" },
      { status: "cancelado", label: "Cancelado" },
      { status: "em_transito", label: "Em Trânsito" },
      { status: "aprovado", label: "Aprovado" },
    ];
    statuses.forEach(({ status, label }) => {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it("renders payment type labels", () => {
    render(<StatusBadge status="deposit" />);
    expect(screen.getByText("Depósito Sinal")).toBeInTheDocument();
  });

  it("renders wallet type labels", () => {
    render(<StatusBadge status="referral_credit" />);
    expect(screen.getByText("Crédito Indicação")).toBeInTheDocument();
  });

  it("renders generic statuses", () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });
});
