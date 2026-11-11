# Portfolio editable — configuración

Portfolio bilingüe (español/inglés) con una portada animada, diseño cálido en naranja rosado y blanco pastel, proyectos, páginas, categorías, enlaces y editor privado dentro del sitio.

## Seguridad de acceso

No guardes contraseñas en `app.js`, `config.js` ni en ningún archivo público: cualquiera puede inspeccionar esos archivos. La contraseña compartida en un chat debe considerarse expuesta; cámbiala y elige una nueva contraseña privada. El acceso de este sitio se valida con Supabase Auth y las políticas RLS; nunca se verifica una contraseña en el navegador.

## 1. Configurar el acceso privado

1. Crea un proyecto en [supabase.com](https://supabase.com/) y en **Authentication → Users** añade tu cuenta con correo y una contraseña nueva y privada. Desactiva los registros públicos.
2. En `config.js`, añade el Project URL y la clave anon/public de **Project Settings → API**. Configura `adminEmail` con el correo exacto de esa cuenta. El atajo de usuario `emiitheadmin` se convierte a ese correo antes de iniciar sesión.
3. En `supabase-schema.sql`, sustituye `YOUR_ADMIN_EMAIL@example.com` por el mismo correo y ejecuta el SQL completo en Supabase **SQL Editor**.
4. Publica el sitio como web estática (por ejemplo, GitHub Pages). Abre **Administrar**, inicia sesión con el usuario configurado y tu contraseña privada. El contenido se edita desde el sitio.

La clave anon es pública por diseño; nunca incluyas una contraseña ni una clave service-role en el frontend. Las políticas del SQL permiten lectura pública del portfolio, pero solo el usuario autenticado con el correo autorizado puede cambiar contenido y subir imágenes.

## Editar contenido

En el sitio inicia sesión y abre **Editar sitio**. Edita español e inglés y las listas JSON de páginas, categorías/subcategorías, proyectos y enlaces. Para proyectos, añade una imagen desde el botón de subida y copia la URL en el campo `image` del JSON. Puedes usar una URL de video en bucle o imagen/GIF para la portada.

Ejemplo de proyecto:

```json
{
  "titleEs": "Identidad visual",
  "titleEn": "Visual identity",
  "categoryEs": "Diseño",
  "categoryEn": "Design",
  "subcategoryEs": "Identidad",
  "subcategoryEn": "Identity",
  "descriptionEs": "Una identidad para una marca independiente.",
  "descriptionEn": "An identity for an independent brand.",
  "image": "https://tu-proyecto.supabase.co/storage/v1/object/public/portfolio-media/imagen.jpg",
  "url": "https://example.com"
}
```
