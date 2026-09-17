# 🎬 MovieExplorer

A simple responsive Movie Explorer app made with React. Browse shows, search by title and see details in a modal.

Made for Programming Hero Assignment 2.

## Features
- Home page with navbar, hero banner and footer
- Movies page with search bar
- Movie cards (poster, title, rating, year, see details button)
- Movie details modal (close with ✕ button or clicking outside)
- Responsive grid (4 column on desktop, 2 on tablet/mobile, 1 on small phones)
- Data from free TVMaze API

## API Used
- All shows: `https://api.tvmaze.com/shows`
- Search: `https://api.tvmaze.com/search/shows?q=girls`
- Docs: https://www.tvmaze.com/api

## Run Locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Pages
- `/` - Home
- `/movies` - Movie listing + search

## Tech
- React + Vite
- React Router
- Plain CSS (no UI library)
