# SSI Correspondence interactive demo

A polished, clickable frontend mockup for a fictional higher-education correspondence and document-intake operations console. It demonstrates controlled automation, attachment classification against configured form definitions, canonical extraction, human QA, knowledge governance, and scheduled release workflows for leadership conversations.

This repository is intentionally a short-lived demonstration. It contains no backend, authentication, live AI, Microsoft integration, external API, real institution, or real personal data.

Live demo: [https://jyoung122.github.io/email-agent-mock/](https://jyoung122.github.io/email-agent-mock/)

## Technology

- Vite
- React
- TypeScript
- React Router
- Lucide React icons
- Static typed fixtures and React Context
- Plain structured CSS

## Run locally

The local workspace may require the bundled NVM toolchain to be added to `PATH`:

```bash
SSI_NODE_BIN=/home/jeremy-young/.nvm/versions/node/v24.13.0/bin
export PATH="$SSI_NODE_BIN:$PATH"
npm install
npm run dev
```

Open the local URL printed by Vite. The default command normally serves the app at `http://127.0.0.1:5173`.

Other useful commands:

```bash
npm run build
npm run lint
npm run test:demo
npm run preview
```

Pushes to `main` deploy the production build to GitHub Pages. The Pages build sets the Vite base path to `/email-agent-mock/` and includes a single-page application fallback for direct links.

## Main demo workflow

1. Open **Work Queue** and select Alex Harper's fictional transcript request.
2. Review its random-QA reason, grounding sources, and two independently assessed attachments.
3. From the request or Response Workbench attachment list, open the PDF in the attachment-review modal; confirm its configured Official Transcript Authorization match, inspect canonical fields, and correct or request resubmission for the missing signature.
4. Within that modal, switch to the supporting image to demonstrate an unmatched/unstructured attachment and its classification options.
5. Return to the workbench, apply a predefined refinement, and approve the response for release.
6. Open **Release Queue** to see the approved response in the locked Registrar batch.
7. Open **Knowledge**, mark the transcript policy changed, and increase QA to 100% to hold affected drafts.
8. Confirm the mode and held state in **Agent Controls** and **Release Queue**.
9. Select **Reset Demo** to restore the original fixture state.

All classifications, draft variants, extraction results, knowledge impacts, and releases are simulated locally. Random QA uses JavaScript randomization only after the batch population is locked.

## Project structure

```text
src/
├── components/    Application shell and shared UI primitives
├── context/       Shared demonstration state and actions
├── data/          Fictional static fixtures
├── hooks/         Shared context hook export
├── pages/         Route-level demo screens
├── types/         Domain interfaces and status types
├── App.tsx        Routes and shell integration
├── main.tsx       React entry point
└── styles.css     Global visual tokens and primitives
```

## Resetting state

Use **Reset Demo** in the persistent header. It discards all local simulated edits, approvals, holds, form decisions, policy changes, and release actions, then recreates state from the original fixtures.
