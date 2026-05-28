# Styles

Los tokens globales de Tailwind v4 viven en `src/app/globals.css` mediante `@theme`.
Esta carpeta queda reservada para estilos compartidos adicionales que no pertenezcan a un componente.

## Reglas de uso

- Tailwind CSS v4 es la fuente tecnica de estilos; no crear `tailwind.config.js` mientras el proyecto siga usando `@theme`.
- Los colores, fuentes, radios y sombras compartidas deben declararse en `src/app/globals.css`.
- Las pantallas deben importar botones, campos, tablas, cards, modales, badges, alertas y paginacion desde `src/components`.
- No crear variantes locales de `Button`, `Input`, `Select`, `Table`, `Card`, `Modal`, `Badge` o `Alert` dentro de `src/features`.
- No usar colores hexadecimales, estilos inline ni clases arbitrarias en pantallas si existe un token o componente compartido.
- Los archivos que renderizan JSX deben usar extension `.jsx`; la logica pura, contratos, helpers y barrels deben usar `.js`.
- Los listados deben contemplar estados `loading`, `empty` y `error`, y usar `Pagination` cuando superen 10 registros.
- Las acciones destructivas deben usar `Button` con variante `danger` y `ConfirmDialog`.
- Las pantallas placeholder pueden usar datos de referencia, pero no deben simular integracion real con backend.
