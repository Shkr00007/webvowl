# UI App Integration Plan

## Goal
Use `/ui-app` as a separate frontend layer without modifying legacy WebVOWL UI files.

## Phase 1 (implemented)
- New React + TypeScript + Tailwind app scaffold.
- Three-panel layout + top navbar.
- `GraphContainer` embeds legacy graph via iframe.
- AI Copilot service wired to Ollama endpoint.

## Phase 2
- Add upload forwarding from React controls into embedded frame.
- Add ontology explorer sync from iframe graph dictionary.
- Add selection and graph-loaded telemetry events.

## Phase 3
- Replace iframe bridge with direct runtime wrapper once stable API contract is available.
- Add auth, persistence, and enterprise analytics.
