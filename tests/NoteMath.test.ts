import { describe, expect, it } from "vitest";
import { describePitch } from "../src/tuner/NoteMath";

describe("describePitch", () => {
  it("maps concert pitch and octaves", () => {
    expect(describePitch(440)).toEqual({ note: "A", octave: 4, cents: 0 });
    expect(describePitch(261.625565)).toEqual({ note: "C", octave: 4, cents: 0 });
  });

  it("uses the configured A4 reference", () => {
    expect(describePitch(442, 442)).toEqual({ note: "A", octave: 4, cents: 0 });
    expect(describePitch(440, 442).cents).toBe(-8);
  });
});
