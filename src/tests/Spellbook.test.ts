import { beforeEach, describe, expect, test } from "vitest";
import Spell from "../domain/Spell";
import Spellbook from "../domain/Spellbook";

let spellbook: Spellbook;

beforeEach(() => {
  spellbook = new Spellbook();
});

describe("Spellbook", () => {
  test("starts empty", () => {
    expect(spellbook.getSpells()).toHaveLength(0);
  });

  test("keeps spells in insertion order", () => {
    const lumos = new Spell("Lumos", "Luz", "book");
    const accio = new Spell("Accio", "Atrae", "movie");
    spellbook.addSpell(lumos);
    spellbook.addSpell(accio);
    expect(spellbook.getSpells()).toEqual([lumos, accio]);
  });

  test("rejects a repeated name", () => {
    spellbook.addSpell(new Spell("Lumos", "Luz", "book"));
    expect(() =>
      spellbook.addSpell(new Spell("Lumos", "Otra", "movie")),
    ).toThrow("ya está");
  });

  test("rejects a repeated name ignoring case", () => {
    spellbook.addSpell(new Spell("Lumos", "Luz", "book"));
    expect(() =>
      spellbook.addSpell(new Spell("LUMOS", "Otra", "movie")),
    ).toThrow("ya está");
  });

  test("returns a copy that does not change the book", () => {
    const copy = spellbook.getSpells() as Spell[];
    copy.push(new Spell("Lumos", "Luz", "book"));
    expect(spellbook.getSpells()).toHaveLength(0);
  });

  test("finds spells by first appearance", () => {
    const lumos = new Spell("Lumos", "Luz", "book");
    spellbook.addSpell(lumos);
    spellbook.addSpell(new Spell("Accio", "Atrae", "movie"));
    expect(spellbook.findByOrigin("book")).toEqual([lumos]);
  });

  test("finds nothing when no spell matches", () => {
    spellbook.addSpell(new Spell("Lumos", "Luz", "book"));
    expect(spellbook.findByOrigin("videogame")).toEqual([]);
  });

  test("finds spells that first appeared in a series", () => {
    const accio = new Spell("Accio", "Atrae", "series");
    spellbook.addSpell(accio);
    expect(spellbook.findByOrigin("series")).toEqual([accio]);
  });

  test("counts spells by first appearance", () => {
    spellbook.addSpell(new Spell("Lumos", "Luz", "book"));
    spellbook.addSpell(new Spell("Nox", "Apaga", "book"));
    spellbook.addSpell(new Spell("Accio", "Atrae", "series"));
    expect(spellbook.countByOrigin()).toEqual({
      book: 2,
      movie: 0,
      videogame: 0,
      series: 1,
    });
  });
});
