# Fandomize Web

Fandomize Web is the browser interface for an image-stylization workflow. A user chooses an image, selects one of the styles in the bundled catalog, adds guidance, and submits the request. The application then displays the image returned by the companion Fandomize service.

The interface is currently written in Portuguese. This repository contains only the web application; image processing and OpenAI integration live in [Fandomize Service](https://github.com/tiagofg/fandomize-service).

## How it works

The project is an npm workspace with the Next.js application in `fandomize/`.

1. [React components](fandomize/src/components/) guide the user through image selection, style selection, review, and result pages.
2. [`TransformContext`](fandomize/src/contexts/TransformContext.tsx) keeps the selected file, style, and details available across the flow and persists them in browser storage.
3. A [Next.js Server Action](fandomize/src/actions/edit-image.actions.ts) sends a multipart request to `POST /edit-image` on the configured service.
4. The submission flow saves the returned base64 image to browser storage, and the result page reads and renders it.

Because the service URL is read by a Server Action, it remains a server-side setting and does not need a `NEXT_PUBLIC_` prefix.

## Technology

- Next.js 15 with the App Router and Server Actions
- React 19 and TypeScript
- Tailwind CSS 4
- Jest, Testing Library, and jsdom
- `browser-image-compression` for files selected through the file picker
- npm workspaces, ESLint, Prettier, lint-staged, and Husky

## Requirements

- Node.js and npm; the supplied Docker image currently uses Node.js 23
- A reachable Fandomize service instance

## Local setup

Run these commands from the repository root:

```bash
npm ci --workspaces --include-workspace-root
cat > fandomize/.env.local <<'EOF'
FANDOMIZE_SERVICE_URL=http://localhost:8000
EOF
npm run --workspace fandomize dev
```

Open `http://localhost:3000`. The configured URL should be the service origin without a trailing endpoint path; the application appends `/edit-image`.

`FANDOMIZE_SERVICE_URL` is required whenever an image is submitted. The home page and selection flow can load without it, but the Server Action throws an error when it is absent.

## Commands

Commands can be invoked from the repository root with `npm run --workspace fandomize <script>`.

| Command | Purpose |
| --- | --- |
| `dev` | Start the Turbopack development server |
| `build` | Create a production build |
| `start` | Run a completed production build |
| `test` | Run the Jest test suite |
| `lint` | Run the lint command declared by the workspace |
| `lint:fix` | Run the declared lint command with automatic fixes |
| `lint:strict` | Run the declared lint command against JavaScript and TypeScript files |
| `prettier` | Format supported source and content files |

The repository currently contains 14 component test files. To run them serially with watch mode disabled, use:

```bash
npm run --workspace fandomize test -- --runInBand --watch=false
```

The root pre-commit configuration formats staged files, applies ESLint fixes to staged source files, and runs related Jest tests.

## Docker and deployment

The multi-stage `Dockerfile` installs the npm workspace from its lockfile, builds the application, and runs it as the unprivileged `node` user on port 3000. Supply `FANDOMIZE_SERVICE_URL` to the environment used by the Next.js server.

The included GitHub Actions workflow deploys pushes to `main` by connecting to a preconfigured host over SSH and rebuilding a Compose service named `frontend`. The Compose file and host provisioning are external to this repository. The workflow does not run linting, tests, or a build verification job before deployment.

## Current limitations

- Server Actions accept request bodies up to 5 MB. The file-picker path compresses images in the browser, but the drag-and-drop path does not currently pass files through the same compression step.
- Source selections and generated base64 images are stored in browser `localStorage`. Large images may exceed browser storage quotas, and the data remains local to that browser profile.
- The web application depends on the service for validation and image generation and does not provide an offline processing mode.
- The deployment workflow assumes an existing server checkout, Docker Compose configuration, and repository secrets.
