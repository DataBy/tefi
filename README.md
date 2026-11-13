# Para Tefi · Una carta que florece 🌸

Una carta interactiva, hecha con cariño para una doctora que ama las flores y cuidar de los demás.

**No es un videojuego.** Es una experiencia web narrativa: un sobre que se abre, flores que revelan mensajes y una carta especial al final.

## Experiencia

- Mobile first, con diseño adaptable a tablets y escritorio
- Apertura de un sobre con animación tridimensional
- Flores ilustradas e interactivas con mensajes individuales
- Movimiento ambiental, pequeñas partículas y transiciones de scroll
- Un abrazo digital y carta final
- Sonidos suaves opcionales, desactivados por defecto
- Soporte para usuarios que prefieren movimiento reducido
- Todo el contenido se ejecuta en el navegador, sin backend ni cuenta

## Tecnología

React 19, Vite, Motion para React, Lucide React y CSS personalizado. Las ilustraciones se dibujan en SVG y no dependen de servicios externos. Las fuentes de Google Fonts tienen alternativas locales.

## Desarrollo local

Requiere Node.js 22 o compatible.

```bash
npm install
npm run dev
```

## Publicación

El repositorio incluye el workflow `.github/workflows/deploy.yml` que compila y publica la app desde la rama `main`.

1. Ir a **Settings → Pages** en GitHub.
2. En **Build and deployment**, seleccionar **GitHub Actions**.
3. La publicación se hará en https://databy.github.io/tefi/.

## Personalización

Editar `src/main.jsx`:

- `FLOWERS`: mensajes escondidos detrás de las tres flores.
- `final-paper`: texto de la carta final.
- `hero`: título y dedicatoria inicial.

El despliegue es público. Evita poner datos personales o información clínica privada en el código.
