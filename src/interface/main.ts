import Spell, {
  FIRST_APPEARANCES,
  ORIGIN_LABELS,
  type FirstAppearance,
} from "../domain/Spell";
import Spellbook from "../domain/Spellbook";
import bookIcon from "./img/book.svg";
import movieIcon from "./img/movie.svg";
import seriesIcon from "./img/series.svg";
import videogameIcon from "./img/videogame.svg";

const ORIGIN_ICONS: Record<FirstAppearance, string> = {
  book: bookIcon,
  movie: movieIcon,
  videogame: videogameIcon,
  series: seriesIcon,
};

const ALERT_DURATION_MS = 2000;
const FADE_DURATION_MS = 500;

const btnAdd = document.getElementById("btn-add") as HTMLButtonElement | null;
const inpName = document.getElementById("inp-name") as HTMLInputElement | null;
const inpDescription = document.getElementById(
  "inp-description",
) as HTMLTextAreaElement | null;
const alertPlaceholder = document.getElementById("alerts-container");

const mainSpellbook = new Spellbook();

function selectedOrigin(): string {
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="first-appearance"]:checked',
  );
  return checked ? checked.value : "";
}

function appendAlert(message: string, type: "success" | "danger"): void {
  if (!alertPlaceholder) {
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = `alert alert-${type}`;
  wrapper.textContent = message;
  alertPlaceholder.append(wrapper);

  setTimeout(() => {
    wrapper.style.transition = `opacity ${FADE_DURATION_MS}ms ease`;
    wrapper.style.opacity = "0";
    setTimeout(() => wrapper.remove(), FADE_DURATION_MS);
  }, ALERT_DURATION_MS);
}

function clearInputs(
  nameElement: HTMLInputElement,
  descriptionElement: HTMLTextAreaElement,
): void {
  nameElement.value = "";
  descriptionElement.value = "";
  const checked = document.querySelector<HTMLInputElement>(
    'input[name="first-appearance"]:checked',
  );
  if (checked) {
    checked.checked = false;
  }
}

function originIcon(
  origin: FirstAppearance,
  cssClass: string,
): HTMLImageElement {
  const image = document.createElement("img");
  image.src = ORIGIN_ICONS[origin];
  image.alt = ORIGIN_LABELS[origin];
  image.className = cssClass;
  return image;
}

function spellItem(spell: Spell): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "list-group-item d-flex align-items-center gap-3";

  const text = document.createElement("div");
  text.className = "flex-grow-1";
  const title = document.createElement("strong");
  title.textContent = spell.name;
  const detail = document.createElement("div");
  detail.className = "small text-muted";
  detail.textContent = spell.description;
  text.append(title, detail);

  const badge = document.createElement("span");
  badge.className = `badge origin-badge origin-${spell.firstAppearance}`;
  badge.textContent = spell.getOriginLabel();

  item.append(originIcon(spell.firstAppearance, "spell-icon"), text, badge);
  return item;
}

function renderCounters(): void {
  const counters = document.getElementById("counters");
  const counts = mainSpellbook.countByOrigin();
  const chips = FIRST_APPEARANCES.map((origin) => {
    const chip = document.createElement("span");
    chip.className = "d-inline-flex align-items-center gap-1";
    chip.append(
      originIcon(origin, "origin-icon"),
      `${ORIGIN_LABELS[origin]}: ${counts[origin]}`,
    );
    return chip;
  });
  counters?.replaceChildren(...chips);
}

function renderSpells(): void {
  document.getElementById("empty-list")?.classList.add("d-none");
  document.getElementById("spells")?.classList.remove("d-none");
  document
    .getElementById("spells-list")
    ?.replaceChildren(...mainSpellbook.getSpells().map(spellItem));
  renderCounters();
}

if (btnAdd && inpName && inpDescription) {
  btnAdd.addEventListener("click", () => {
    const errorContainer = document.getElementById("add-spell-error");
    const errorMessage = document.getElementById("add-spell-error-msg");
    try {
      const newSpell = new Spell(
        inpName.value,
        inpDescription.value,
        selectedOrigin() as FirstAppearance,
      );
      mainSpellbook.addSpell(newSpell);
      clearInputs(inpName, inpDescription);
      errorContainer?.classList.add("d-none");
      renderSpells();
      appendAlert(`${newSpell.name} agregado correctamente!`, "success");
    } catch (error) {
      errorContainer?.classList.remove("d-none");
      if (errorMessage) {
        errorMessage.innerText =
          error instanceof Error ? error.message : String(error);
      }
    }
  });
}
