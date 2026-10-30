# Guía docente — Ejercicio Spellbook

*Resolución comentada de las Partes A, B y C, con foco en los desafíos de ESLint y de codificación. No incluye pasos de setup. Los archivos se indican con su ruta dentro del repositorio; los elementos de código se nombran por su función y no por número de línea, porque cambian cuando los estudiantes van refactorizando.*

## Antes de corregir: qué hace cada comando por sí solo

Para saber qué trabajo manual queda, conviene tener claro qué resuelven las herramientas automáticamente:

* `npm run format` reformatea 3 archivos: `src/domain/Spell.ts`, `src/domain/Spellbook.ts` y `src/interface/main.ts` (comillas simples, sin punto y coma, indentación de 4 espacios y líneas largas).
* `npm run lint` ejecuta `eslint --fix`, que corrige solo **dos** hallazgos: `no-var` en `src/domain/Spellbook.ts` y `prefer-const` en `src/tests/Spell.test.ts`.
* Todo lo demás es manual: `eqeqeq` no se autocorrige, ni tampoco `no-param-reassign`, `no-console`, `no-alert`, `no-useless-assignment` ni las tres reglas que se agregan en la Parte A.

## Parte A — ESLint, Prettier y buenas prácticas

Para la Parte A, se hace:

* Agregar tres reglas en `eslint.config.js`: `no-template-curly-in-string` (como `"warn"`), `id-length` (`["warn", { min: 3 }]`) y `no-magic-numbers` (`["warn", { ignore: [0, 1] }]`).
* Corregir los hallazgos de cada archivo, como se detalla a continuación.

> `no-useless-assignment` ya viene activa como error por `js/recommended`, por eso no se pide agregarla. Si un estudiante la agrega como `"warn"`, está bajando su severidad: conviene señalárselo.

### Archivo `src/domain/Spell.ts`

* **`no-param-reassign`** en el constructor, donde se hace `name = name.trim()`: se crea `const trimmedName = name.trim()` y se usa ese valor en las validaciones y en `this.name`. El error típico es limpiar el valor pero seguir validando contra el parámetro original.
* **`eqeqeq`** (3 casos): dos `== 0` en las validaciones del constructor y el `==` de `isOriginal()`. Todos pasan a `===`.
* **`no-useless-assignment`** en `describe()`: se elimina `let text = ""` y se retorna directamente el template literal.
* **`no-magic-numbers`** con el `120` del límite de descripción: se extrae `const MAX_DESCRIPTION_LENGTH = 120` y se usa tanto en la condición como en el mensaje de error, que hoy tiene el `120` escrito a mano. Si solo extraen la constante para la condición, el mensaje queda desincronizado.

### Archivo `src/domain/Spellbook.ts`

* **`no-var`**: lo corrige `--fix` y queda `const exists`.
* **`eqeqeq`** en la comparación de nombres sin distinguir mayúsculas: pasa a `===`.
* **`no-console`**: se elimina el `console.log` de `addspell`. Un método de dominio no debería escribir en consola.
* **`no-template-curly-in-string`**: el log usa comillas comunes con `${spell.Name}`, por lo que imprimiría el texto literal. Se resuelve solo al eliminar el log. Si lo cambian a backticks, solo pasan de un warning a otro (`no-console`). Es una buena oportunidad para mostrar que los dos avisos señalan el mismo problema.
* **`id-length`** (3 casos): `s` en el `some` de `addspell`, `s` en el `filter` de `findByOrigin` y `sp` en el `for` de `countByOrigin`. Se renombran con nombres que expliquen qué representan, por ejemplo `existing` y `spell`.

### Archivo `src/interface/main.ts`

* **`no-console`**: se elimina el `console.log(mainSpellbook.getSpells().length)`.
* **`no-alert`**: se reemplaza `alert(...)` por una función `appendAlert` que escribe en el contenedor `#alerts-container`, que ya existe en `index.html`. La referencia es `git-tasks`.
* **`id-length`**: `e` en el `catch` pasa a `error` y `sp` en `spellItem` pasa a `spell`.
* **Tropiezo frecuente con `no-magic-numbers`**: el `appendAlert` de `git-tasks` usa `2000` y `500` en los `setTimeout`. Quien lo copie recibe dos warnings nuevos y debe extraer constantes con nombre (por ejemplo `ALERT_DURATION_MS` y `FADE_DURATION_MS`).
* **Extra, sin penalizar:** ese mismo `appendAlert` arma el mensaje con `innerHTML`, y el mensaje incluye el nombre del hechizo, que es texto ingresado por el usuario. Se puede cerrar usando `textContent`. Es un buen disparador para hablar de inyección de HTML.

### Archivo `src/tests/Spell.test.ts`

* **`prefer-const`** sobre `let lumos`: lo corrige `--fix`.

### Buenas prácticas que el linter no detecta

Estos puntos hay que revisarlos a mano, porque ninguna regla los marca:

* **Nomenclatura**: la propiedad `Name` (en mayúscula) pasa a `name` en `src/domain/Spell.ts`, y `addspell` pasa a `addSpell` en `src/domain/Spellbook.ts`.
* **Idioma del código**: `descripcion` pasa a `description` en `src/domain/Spell.ts`.
* **Tipos de retorno explícitos**: `isOriginal(): boolean`, `getOriginLabel(): string` y `describe(): string` en `src/domain/Spell.ts`, y `clearInputs(...): void` en `src/interface/main.ts`.
* **Cómo renombrar sin romper nada**: conviene usar *Rename Symbol* (F2) de VS Code en lugar de buscar y reemplazar. Los renombres impactan en `Spell.ts`, `Spellbook.ts`, `interface/main.ts` y en los tests. Si queda algún uso sin actualizar, `npm run build` lo marca.

### Qué revisar al corregir la Parte A

* `npm run lint` termina con 0 errores y 0 warnings.
* `npm run format` no produce cambios.
* No hay comentarios `eslint-disable` en `src/` (se puede buscar con `grep -r "eslint-disable" src/`).
* El `git diff` de `eslint.config.js` solo agrega las tres reglas y no elimina ninguna existente.

## Parte B — Pruebas unitarias

El punto de partida es 57,89 % de cobertura de líneas en `Spell.ts` y 0 % en `Spellbook.ts`, con un único test (`isOriginal()` para un hechizo de libro).

Para la Parte B, se hace:

### Archivo `src/tests/Spell.test.ts`

* Probar que un nombre vacío y un nombre con solo espacios lanzan error. Son dos casos distintos, porque el constructor aplica `trim()` antes de validar.
* Probar que un nombre con espacios alrededor se guarda recortado. Este test también protege el refactor de `no-param-reassign` de la Parte A.
* Probar que una descripción vacía o con solo espacios lanza error.
* Probar los **valores límite** de la descripción: exactamente 120 caracteres es válido y 121 lanza error. Este es el caso de profundidad más importante de la clase.
* Probar que una primera aparición inválida lanza error. TypeScript no permite pasar un valor inválido, por lo que hace falta un cast (por ejemplo `"" as FirstAppearance`). Conviene señalar esto, porque muchos estudiantes se traban acá.
* Probar `isOriginal()` para un hechizo de libro (verdadero) y para uno de otro origen (falso).
* Probar `getOriginLabel()` y `describe()`, que son los dos métodos sin cubrir.

### Archivo `src/tests/Spellbook.test.ts` (archivo nuevo)

* Probar que el libro arranca vacío.
* Probar que `getSpells()` respeta el orden de inserción.
* Probar que agregar un nombre repetido lanza error.
* Probar que un nombre repetido con distinta capitalización (`"LUMOS"` contra `"Lumos"`) también lanza error.
* Probar que `getSpells()` devuelve una **copia**: modificar el resultado no altera el libro. El tipo de retorno es `readonly`, así que hace falta un cast a `Spell[]` para poder modificarlo en el test.
* Probar `findByOrigin` con coincidencias y sin coincidencias.
* Probar `countByOrigin` con hechizos de varios orígenes.

### Principales desafíos de esta parte

* **Cobertura no es calidad**: se puede llegar al 100 % solo con casos felices. La profundidad está en los límites (120 y 121), los casos negativos, la comparación sin distinguir mayúsculas y la copia defensiva. Es lo que hay que mirar al corregir.
* **`Spellbook` no se puede ignorar**: `vitest.config.ts` limita la cobertura a `src/domain/**`, por lo que un estudiante que solo testee `Spell` no llega a 100 %.
* **Aislamiento entre tests**: usar un `beforeEach` que cree un `Spellbook` nuevo. Compartir una única instancia entre tests es un error común y genera dependencias de orden.
* **Los tests también pasan por el linter y Prettier**: un estudiante puede cerrar la Parte B con tests que rompen la Parte A.

### Qué revisar al corregir la Parte B

* `npm run test` muestra 100 % en `Spell.ts` y `Spellbook.ts` (líneas, ramas y funciones).
* Están los casos de profundidad listados arriba, no solo los que alcanzan el porcentaje.
* No se modificó el comportamiento de las clases para facilitar los tests.

## Parte C — La opción Serie

Esta parte combina tres tipos de error con distinta forma de detección: los que marca el compilador, el que solo detectan los tests y el que solo se ve en pantalla.

Para la Parte C, se hace:

* Agregar `"series"` a la unión `FirstAppearance` en `src/domain/Spell.ts`.

### Lo que marca el compilador (`npm run build` da 3 errores)

* En `src/domain/Spell.ts`, completar `ORIGIN_LABELS` con `series: "Serie"`.
* En `src/domain/Spellbook.ts`, completar el objeto inicial de `countByOrigin` con `series: 0`.
* En `src/interface/main.ts`, importar `./img/series.svg` y completar `ORIGIN_ICONS` con `series: seriesIcon`.

### Lo que el compilador no detecta

* **`FIRST_APPEARANCES` en `src/domain/Spell.ts`**: es un array tipado como `FirstAppearance[]`, que acepta que falten valores. Si no se agrega `"series"`, el constructor rechaza el hechizo con el mensaje "Debe indicar la primera aparición", y además el contador de la interfaz (que recorre esta lista) no muestra "Serie". Solo lo detecta un test o probar la app. Es el punto central de la Parte C y justifica por qué la Parte B importa.
* **`index.html`**: agregar el cuarto radio con `id="appearance-series"` y `value="series"`, y con el ícono `./src/interface/img/series.svg` dentro del `label`, igual que los otros tres. El `value` tiene que coincidir exactamente con `"series"`, o el constructor lo rechaza.
* **`src/interface/style.css`**: agregar `.origin-series { background-color: ... }` con un color distinto de los otros tres. Sin esta clase, la etiqueta tiene texto blanco (por `.origin-badge`) sobre fondo transparente y queda prácticamente invisible. Eso solo se ve en pantalla, por eso la entrega pide captura de la aplicación.

### Tests nuevos

* Probar que `new Spell(..., "series")` no lanza error.
* Probar que `getOriginLabel()` devuelve `"Serie"`.
* Probar que `isOriginal()` es falso para la serie.
* Probar `findByOrigin("series")` y que `countByOrigin()` incluya la clave `series`.
* **Actualizar los tests de la Parte B**: si algún test compara `countByOrigin()` con `toEqual({ book, movie, videogame })`, falla al agregar la clave `series`. Es muy probable que ocurra y conviene que los estudiantes lo noten ellos mismos.

### Para discutir en clase

* La lista `FIRST_APPEARANCES` duplica información que ya está en el tipo. Se podría derivar el tipo del array con `as const` (`type FirstAppearance = typeof FIRST_APPEARANCES[number]`), de modo que agregar un valor sea un solo cambio y el compilador marque el resto. Vale la pena preguntar a los estudiantes cómo evitarían el fallo silencioso.

### Qué revisar al corregir la Parte C

* `npm run build` termina sin errores.
* `npm run lint` sigue en 0 errores y 0 warnings.
* `npm run test` sigue en 100 % de cobertura, con tests específicos para la serie.
* En la captura de la aplicación se ven hechizos de las cuatro primeras apariciones, con ícono, etiqueta de color distinto para la serie y el contador "Serie: N" en la lista.
