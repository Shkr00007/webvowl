# UI App Integration Plan

## Goal
Build `/ui-app` as a separate React + TypeScript + Tailwind frontend layer and keep legacy WebVOWL code untouched.

## Principles
- WebVOWL is a black-box graph engine.
- React owns the product UI layout and interactions.
- No D3 UI rendering in React components.

## Phase 1 (implemented)
- New app scaffold and architecture (`components`, `services`, `hooks`, `types`).
- Modern layout: TopBar, Sidebar, GraphContainer, AI Copilot.
- `GraphContainer` mounts WebVOWL runtime through a ref-based black-box bridge service.
- Ollama integration service added for chat and node explanations.

## Phase 2
- Replace placeholder selection bridge with stable runtime event adapter from WebVOWL.
- Add ontology node sync from engine data.
- Add upload + graph actions in TopBar.
