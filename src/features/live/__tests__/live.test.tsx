import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/render";
import { LiveToggle } from "../LiveToggle";

afterEach(() => vi.unstubAllGlobals());

describe("live mode", () => {
  it("stops reconnecting once the session has expired, and says how to resume", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    renderWithProviders(<LiveToggle />, { searchParams: "?live=true" });

    expect(await screen.findByText("Sign in again to resume")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
