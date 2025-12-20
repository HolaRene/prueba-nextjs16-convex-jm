# Documentación de la página de blogs

## Descripción general

Esta página muestra una lista de blogs en formato de tarjetas. Utiliza componentes de UI personalizados y aprovecha el sistema de caché de Next.js para optimizar la obtención de datos desde el backend (Convex). Incluye metadatos para SEO y una interfaz amigable para el usuario.

---

## Estructura principal

- **Metadata**: Define el título, descripción, categoría y autor de la página para SEO.
- **BlogPage**: Componente principal que renderiza el título, una breve descripción y la lista de blogs usando el componente `LoadBlog`.
- **LoadBlog**: Función asíncrona que obtiene los blogs desde el backend usando `fetchQuery` y los muestra en tarjetas. Utiliza caché por una hora y etiqueta de caché "blog".
- **SkeletonLaodingUI**: Componente de esqueleto para mostrar placeholders mientras se cargan los datos (actualmente no se usa, pero está preparado para loading states).

---

## Detalles de implementación

- **Caché**: Se usa `"use cache"`, `cacheLife("hours")` y `cacheTag("blog")` para optimizar la obtención de datos.
- **Obtención de datos**: Se llama a `fetchQuery(api.blogs.obtenerBlogs)` para traer los blogs desde Convex.
- **Renderizado**: Cada blog se muestra en una tarjeta con imagen, título, cuerpo y un botón para leer más.
- **Navegación**: El título y el botón "Leer más" llevan a la página individual del blog.
- **Accesibilidad**: Las imágenes tienen atributo `alt` y los botones usan variantes accesibles.

---

## Ejemplo de uso

La página se accede desde la ruta `/blogs` y muestra todos los blogs disponibles en el sistema, permitiendo navegar a cada uno para ver su contenido completo.

