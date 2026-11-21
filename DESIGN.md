---
version: alpha
name: Monster Expedition Map
description: A map-first companion for players exploring A Monster's Expedition.
colors:
  primary: "#558b2f"
  water: "#40a4df"
  surface: "#ffffff"
  ink: "#171717"
typography:
  sans:
    fontFamily: "Open Sans, Arial, sans-serif"
  serif:
    fontFamily: "Noto Serif, Georgia, serif"
  mono:
    fontFamily: "ui-monospace, monospace"
rounded:
  control: "0.5rem"
omitted:
  - section: spacing
    reason: Existing Tailwind spacing utilities remain canonical.
  - section: components
    reason: This small app uses the component owners documented below.
---

# Monster Expedition Map

## Overview

An explorer's illustrated map with quiet utility controls. The game world is the visual focus; progress and help support exploration. The product serves players with an English interface on desktop and phones. No region-specific audience is established by the repository.

This file documents the existing identity. `src/app/globals.css` remains the canonical runtime token source; `src/app/layout.tsx` owns fonts. No token generation is used. Keep these documented values aligned when either source changes.

## Colors

Green identifies navigation, actions and progress; blue belongs to the map and links. White statistics surfaces use dark text. Error and recovery copy must remain readable and communicate state in words as well as color. The app currently combines fixed light panels with an OS-dependent document background; this change does not introduce a new theme.

## Typography

Use Open Sans for controls and guidance, Noto Serif for exhibit names and statistics, and monospace for coordinates and paths. Preserve the existing English labels and sentence case for new actions.

## Layout

The home page reserves 70% of the viewport for the map, then a 40px navigation bar and a scrolling statistics panel. Statistics use one column on phones and three from the existing `md` breakpoint. About uses a naturally scrolling text column. Feedback belongs beside the import action and must not obscure the map.

## Elevation & Depth

Keep statistics flat. Existing map filters, popups and image overlays use borders and shadows for separation. Do not add decorative cards around individual statistics.

## Shapes

Preserve rounded controls and simple rectangular progress bars. Reuse existing Tailwind radius utilities.

## Components

- `Header.tsx`: shared home/About navigation.
- `GameMap.tsx`: map controls, layers and solution overlays.
- `StatsPanel.tsx`: the canonical save picker, busy state, inline errors, storage feedback and statistics. File selection stays native; processing stays local. Importing invalid data preserves previous progress. Storage failure keeps the new progress for this visit and explains the limitation. Use live status/error text and visible keyboard focus.
- `utils/progress.ts`: validation, normalization, stored progress format, browser subscription and server-safe storage snapshot. Other tabs reflect committed storage updates; read operations never overwrite stored data. A temporary import survives client-side navigation until it is superseded or the tab reloads.

New progress transitions respect reduced motion. Preserve the illustration and existing Lucide icon vocabulary. Do not infer completed map markers from an unverified save-ID mapping.

## Do's and Don'ts

- Keep the map prominent and operational guidance concise.
- Name local file processing “Import save” and explain where progress is stored.
- Do not imply an import changes the game file or uploads it to a server.
- Do not introduce a separate visual system for the statistics panel.
