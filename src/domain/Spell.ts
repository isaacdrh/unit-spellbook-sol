/**
 * Where a spell showed up for the first time.
 */
export type FirstAppearance = "book" | "movie" | "videogame" | "series";

export const FIRST_APPEARANCES: FirstAppearance[] = [
  "book",
  "movie",
  "videogame",
  "series",
];

export const ORIGIN_LABELS: Record<FirstAppearance, string> = {
  book: "Libro",
  movie: "Película",
  videogame: "Videojuego",
  series: "Serie",
};

const MAX_DESCRIPTION_LENGTH = 120;

/**
 * Represents a spell of the spellbook.
 *
 * @class
 */
class Spell {
  name: string;
  description: string;
  firstAppearance: FirstAppearance;

  /**
   * Creates an instance of the Spell class.
   *
   * @constructor
   * @param {string} name - The name of the spell.
   * @param {string} description - What the spell does.
   * @param {FirstAppearance} firstAppearance - Where the spell appeared first.
   * @throws {Error} Throws an error if any of the data is not valid.
   */
  constructor(
    name: string,
    description: string,
    firstAppearance: FirstAppearance,
  ) {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error("El nombre del hechizo no puede ser vacío");
    }
    if (description.trim().length === 0) {
      throw new Error("La descripción del hechizo no puede ser vacía");
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(
        `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres`,
      );
    }
    if (!FIRST_APPEARANCES.includes(firstAppearance)) {
      throw new Error("Debe indicar la primera aparición del hechizo");
    }
    this.name = trimmedName;
    this.description = description;
    this.firstAppearance = firstAppearance;
  }

  /**
   * Checks if the spell was first seen in the original books.
   *
   * @return {boolean} True if the first appearance was a book.
   */
  isOriginal(): boolean {
    return this.firstAppearance === "book";
  }

  /**
   * Returns the text shown to the user for the first appearance.
   *
   * @return {string} The label of the first appearance.
   */
  getOriginLabel(): string {
    return ORIGIN_LABELS[this.firstAppearance];
  }

  /**
   * Returns a one-line description of the spell.
   *
   * @return {string} The name, origin and description of the spell.
   */
  describe(): string {
    return `${this.name} (${this.getOriginLabel()}): ${this.description}`;
  }
}

export default Spell;
