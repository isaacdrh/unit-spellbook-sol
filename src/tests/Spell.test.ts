import { describe, expect, test } from "vitest";
import Spell, {
  FIRST_APPEARANCES,
  type FirstAppearance,
} from "../domain/Spell";

const LIMIT = 120;
const lumos = new Spell("Lumos", "Ilumina la punta de la varita", "book");

describe("Spell creation", () => {
  test("trims the name", () => {
    expect(new Spell("  Lumos  ", "Luz", "book").name).toBe("Lumos");
  });

  test("rejects an empty name", () => {
    expect(() => new Spell("", "Luz", "book")).toThrow("nombre");
  });

  test("rejects a name with only spaces", () => {
    expect(() => new Spell("   ", "Luz", "book")).toThrow("nombre");
  });

  test("rejects an empty description", () => {
    expect(() => new Spell("Lumos", "  ", "book")).toThrow("descripción");
  });

  test("accepts a description of exactly the limit", () => {
    expect(() => new Spell("Lumos", "a".repeat(LIMIT), "book")).not.toThrow();
  });

  test("rejects a description over the limit", () => {
    expect(() => new Spell("Lumos", "a".repeat(LIMIT + 1), "book")).toThrow(
      "120",
    );
  });

  test("rejects a first appearance that is not valid", () => {
    expect(() => new Spell("Lumos", "Luz", "" as FirstAppearance)).toThrow(
      "primera aparición",
    );
  });
});

describe("Spell behaviour", () => {
  test("a spell from a book is original", () => {
    expect(lumos.isOriginal()).toBe(true);
  });

  test("a spell from a movie is not original", () => {
    expect(new Spell("Lumos", "Luz", "movie").isOriginal()).toBe(false);
  });

  test("every first appearance has a label", () => {
    for (const origin of FIRST_APPEARANCES) {
      expect(new Spell("Lumos", "Luz", origin).getOriginLabel()).not.toBe("");
    }
  });

  test("describes the spell in one line", () => {
    expect(lumos.describe()).toBe(
      "Lumos (Libro): Ilumina la punta de la varita",
    );
  });
});

describe("Series as first appearance", () => {
  const spell = new Spell("Accio", "Atrae un objeto", "series");

  test("is a valid first appearance", () => {
    expect(FIRST_APPEARANCES).toContain("series");
  });

  test("is labelled as Serie", () => {
    expect(spell.getOriginLabel()).toBe("Serie");
  });

  test("is not original", () => {
    expect(spell.isOriginal()).toBe(false);
  });
});
