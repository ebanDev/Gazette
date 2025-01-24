# 📰 Gazette

A modern web application for reading and managing news articles from Europress, built with Vue 3 and Konsta UI. Built on top of [Europresse API](https://github.com/ebanDev/europresse-api).

## 🌟 Features

- **Article Search**: Advanced search functionality with multiple filters
  - Search by title or full text
  - Filter by date ranges (Today, This Week, This Month, All Time)
  - Real-time search results with loading skeletons

- **Bookmarking System**: Save and manage your favorite articles
  - Add/remove bookmarks with confirmation dialogs
  - Persistent storage of bookmarked articles
  - Quick access to saved articles

- **Clean Reading Experience**
  - Beautiful typography with Inter and Playfair Display fonts
  - Responsive design for all devices
  - Distraction-free reading mode

- **Export Capabilities**
  - Export articles in various formats
  - Save articles for offline reading

## 🛠️ Technical Stack

- **Framework**: Vue 3 with TypeScript
- **UI Framework**: Konsta UI (iOS/Android style components)
- **Icons**: Tabler Icons
- **State Management**: Pinia with persistence
- **Styling**: SCSS & Tailwind CSS

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/ebanDev/gazette
cd gazette
```

2. Install dependencies
```bash
bun install
```

3. Start the development server
```bash
bun run dev
```

## 📦 Project Structure

```
gazette/
├── components/          # Reusable Vue components
│   ├── ArticleViewer   # Article reading component
│   ├── Search          # Search interface
├── pages/              # Application pages
├── stores/             # Pinia stores
└── utils/              # Utility functions
```

## 🎨 UI Components

The application uses Konsta UI components for a native feel:
- `k-popup` for modals and article viewing
- `k-navbar` for navigation
- `k-list` for article listings
- `k-dialog` for confirmations

## 📝 License

[AGPL 3.0 License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
