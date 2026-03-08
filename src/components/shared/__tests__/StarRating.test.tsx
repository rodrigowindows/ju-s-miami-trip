import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StarRating from "@/components/shared/StarRating";

describe("StarRating", () => {
  it("renders 5 stars", () => {
    const { container } = render(<StarRating value={3} readonly />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(5);
  });

  it("fills stars up to value", () => {
    const { container } = render(<StarRating value={3} readonly />);
    const stars = container.querySelectorAll("svg");
    // First 3 should be filled (have fill-amber-400 class)
    const filled = Array.from(stars).filter(s => s.classList.contains("fill-amber-400"));
    expect(filled).toHaveLength(3);
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    const { container } = render(<StarRating value={2} onChange={onChange} />);
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[3]); // click 4th star
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("disables buttons when readonly", () => {
    const { container } = render(<StarRating value={3} readonly />);
    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});
