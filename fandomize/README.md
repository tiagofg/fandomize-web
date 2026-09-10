# Web workspace guide

This directory is the `fandomize` npm workspace and contains the Next.js application. Repository-level dependency installation, hooks, and container configuration live one directory above it; start with the [root README](../README.md) for full setup and deployment notes.

## Directory map

| Path | Responsibility |
| --- | --- |
| `src/app/` | App Router pages, layout, and route-level UI |
| `src/actions/` | Server Actions, including the call to the image service |
| `src/components/` | Reusable interface components and their Jest tests |
| `src/contexts/` | State shared across the transformation flow |
| `src/constants/` | Style catalogs shown in the interface |
| `src/lib/` | Shared utility functions |
| `public/` | Static assets |

The main routes are `/`, `/transformar`, and `/resultado`. The transformation state is held in `TransformContext`, while `src/actions/edit-image.actions.ts` sends the selected file and options to the backend.

## Working in this directory

After installing dependencies at the repository root, these commands can be run here:

```bash
npm run dev
npm test -- --runInBand --watch=false
npm run build
```

Create `.env.local` in this directory for local development:

```dotenv
FANDOMIZE_SERVICE_URL=http://localhost:8000
```

When adding a style, keep the UI catalog in `src/constants/` aligned with the style values accepted by the service. The submitted `value` is used as the `image_style` multipart field.

Component tests sit beside their components as `*.test.tsx`. Jest uses the jsdom environment and loads `jest.setup.js` for Testing Library matchers.
