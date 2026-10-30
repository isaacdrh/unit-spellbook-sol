# Ejercicio Spellbook

Un libro de hechizos del mundo de Harry Potter. Cada hechizo tiene un **nombre**, una **descripción** y la **primera aparición** del hechizo (libro, película o videojuego).

**Objetivos:**

- Realizar análisis estático de código con **ESLint** y dar formato con **Prettier**
- Aplicar buenas prácticas de codificación
- Codificar casos de test unitario, analizar cobertura y profundidad de las pruebas
- Implementar una nueva funcionalidad en una aplicación **TypeScript** existente

### Estructura del proyecto

```
src/
├── domain/          # Lógica del negocio (Spell, Spellbook)
├── interface/       # Todo lo visual
│   ├── main.ts      # Conecta el formulario con el dominio
│   ├── style.css    # Estilos
│   ├── favicon.ico
│   └── img/         # Imagen principal e íconos por primera aparición
└── tests/           # Pruebas unitarias
index.html           # Formulario y lista de hechizos
```

### Iniciar el proyecto

1. Realizá un fork del repositorio. A partir de este punto, se trabajará en el repositorio creado en este paso.
2. Clonar el fork:

   ```bash
   git clone https://github.com/<USUARIO>/code-spellbook
   ```

3. Abrir la carpeta del proyecto en **Visual Studio Code**.
4. Abrir una terminal dentro de Visual Studio Code y ejecutar:

   ```bash
   npm install
   ```

5. Una vez finalizada la instalación, ejecutar:

   ```bash
   npm run dev
   ```

6. Abrir en el navegador la dirección que aparece en la terminal.
7. Recorrer la app: agregar hechizos eligiendo cada una de las primeras apariciones, intentar agregar uno sin nombre, sin descripción o sin primera aparición, y agregar dos hechizos con el mismo nombre.

> 💡 `npm run dev` queda ejecutándose en esa terminal. Para el resto de los comandos (`npm run lint`, `npm run test`, etc.) abrir una terminal nueva.

> 💡 Se trabaja siempre sobre la rama `main` del fork.

### Parte A — Análisis estático y formato (2 pts)

1. En la terminal ejecutar `npm run format` y `npm run lint` para corregir formato y analizar código.
2. Agregar reglas en `eslint.config.js` para generar warnings: `no-template-curly-in-string`, `id-length` (`min: 3`), `no-magic-numbers` (con `ignore: [0, 1]`).
3. Corregir los problemas reportados por el linter. **No se permite** silenciar reglas con comentarios `eslint-disable` ni quitar reglas de la configuración. Para avisar al usuario, usar el contenedor `alerts-container` de la página en lugar de `alert`.
4. Aplicar buenas prácticas de codificación (ej: nomenclatura, idioma del código, tipos de retorno explícitos).

Hacer commit de los cambios y push al repositorio remoto.

Crear un issue con título `Parte A` y subir una captura de la terminal con 0 warnings y 0 errores.

### Parte B — Pruebas unitarias (2.5 pts)

1. En la terminal ejecutar `npm run test`
2. Codificar casos de test unitario hasta alcanzar 100% de cobertura en `Spell` y `Spellbook`
3. Agregar casos de test unitario para profundizar las pruebas (ej: límites, datos no válidos, nombres repetidos con distinta capitalización, que `getSpells` devuelva una copia)

Nota: no realizar cambios en el funcionamiento de las clases, solo agregar test unitarios. Los tests también deben pasar el linter y el formato.

Hacer commit de los cambios y push al repositorio remoto.

Crear un issue con título `Parte B` y subir una captura de la terminal que muestre ejecución de casos y cobertura 100%.

### Parte C — Nueva funcionalidad: la serie (2.5 pts)

Ahora los hechizos también pueden haber aparecido por primera vez en una **serie**. Agregar esta opción a la aplicación, tanto en la lógica como en lo visual:

1. **HTML:** agregar **Serie** como cuarto radio button del formulario, con el mismo formato que los otros tres. El ícono ya está disponible en `src/interface/img/series.svg`.
2. **Interfaz (`main.ts`):** al agregar un hechizo de la serie, la lista debe mostrar su ícono y su etiqueta `Serie`, y el contador por primera aparición debe incluirla.
3. **Estilo (`style.css`):** la etiqueta de la serie debe tener un color propio, distinto de las otras tres.
4. **Dominio:** un hechizo creado con primera aparición `series` no debe ser rechazado por la validación.
5. **Tests:** agregar casos de test unitario para la nueva opción. La cobertura debe seguir en 100%.
6. `npm run lint` debe seguir sin warnings ni errores y `npm run build` debe terminar sin errores de compilación.

> 💡 `npm run dev` no verifica los tipos de TypeScript, pero `npm run build` sí. Si algún cambio quedó incompleto, el compilador te va a indicar dónde. Hay cambios que el compilador no puede detectar: revisá la app en el navegador.

Hacer commit de los cambios y push al repositorio remoto.

Crear un issue con título `Parte C` y subir:

- Una captura de la aplicación mostrando la lista con al menos un hechizo de cada una de las cuatro primeras apariciones (íconos, etiquetas de color y contador visibles)
- Una captura de la terminal con `npm run test` (cobertura 100%) y otra con `npm run build` sin errores

### Referencias y recursos útiles

- [ESLint](https://eslint.org/docs/latest/rules/)
- [Prettier](https://prettier.io/docs/)
- [Vitest](https://vitest.dev/guide/)
- [TypeScript](https://www.typescriptlang.org/docs/)
