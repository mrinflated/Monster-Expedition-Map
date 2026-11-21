<div align="center">
  <img src="src/app/icon.png" alt="Monster Expedition Map" width="80" height="80">
  <h1>🗺️ Monster Expedition Map</h1>
  <p><strong>An interactive map and progress tracker for A Monster's Expedition</strong></p>
  
  <p>
    <a href="https://mrinflated.github.io/Monster-Expedition-Map/"><strong>🚀 View Live Map</strong></a>
  </p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

![Monster Expedition Map Screenshot](docs/screenshot.png)

---

## ✨ Features

- 🗺️ **Interactive Map** — Pan, zoom, and explore the full game world
- 🎯 **Exhibit Tracker** — Mark exhibits as you discover them
- ⛄ **Friend Locator** — Find all hidden friends on the islands
- 💡 **Puzzle Solutions** — Step-by-step guides with images
- 💾 **Save Import** — View progress statistics, retained locally across visits

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mrinflated/Monster-Expedition-Map.git
cd Monster-Expedition-Map

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the map.

Use Node.js 22.18 or later and pnpm 9, matching the CI environment.

## Save progress

Choose **Import save** and select the extensionless file named `save` from your game's save slot folder. Files up to 10 MiB are supported. Imports validate progress IDs and count duplicate IDs once. An invalid import leaves your previous progress intact.

Your file is processed on your device. Only the exhibit, friend, and island progress IDs are retained in this browser's local storage, and they are restored after refresh or a return visit. Import again after making more progress in the game. Clearing site data removes the stored progress. If browser storage is unavailable, the statistics remain available for the current visit and a message explains that they could not be saved.

Progress statistics do not currently mark completed items on the map.

## Development checks

```bash
pnpm lint
pnpm test
pnpm build
pnpm typecheck
```

Pull requests run all four checks. The deployment workflow also checks changes before publishing to GitHub Pages. Tests use Node's built-in test runner and need no additional testing dependencies.

## 🛠️ Tech Stack

| Technology                                 | Purpose          |
| ------------------------------------------ | ---------------- |
| [Next.js 16](https://nextjs.org/)          | React framework  |
| [React 19](https://react.dev/)             | UI library       |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling          |
| [Leaflet](https://leafletjs.com/)          | Interactive maps |
| [Lucide React](https://lucide.dev/)        | Icons            |

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── about/        # About page
│   └── page.tsx      # Main map page
├── components/       # React components
│   ├── Layout/       # Header, Footer
│   └── Map/          # GameMap component
└── data/             # Markers and coordinates
```

## 🙏 Credits

- **Map** — [Taylor Gratzer](https://monsterexpedition.tgratzer.com)
- **Solutions** — [Innocentive](https://steamcommunity.com/sharedfiles/filedetails/?id=2239781361)
- **Game** — [Draknek & Friends](https://www.drakhollow.com/)

## 📄 License

MIT © [mrinflated](https://github.com/mrinflated)

---

<div align="center">
  <sub>Made with ❤️ for fellow monster expedition explorers</sub>
</div>
