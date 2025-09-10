# NANI TECH DevShop Website

A modern, minimalist, and AI-focused platform designed to showcase software development services. Built with React, Vite, and Tailwind CSS.

## Features

- Interactive Hero Section with circuit animations
- Services Showcase with glassmorphic cards
- Project Portfolio with filtering capabilities
- About Section with company stats and team
- Blog Section with search and category filters
- Booking System for client meetings
- Contact Form with comprehensive details
- Responsive Design for all devices
- Supabase Integration for backend services

## Technology Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 4.3.9
- **Styling:** Tailwind CSS 3.3.2
- **Animations:** Framer Motion 10.12.16
- **Icons:** Lucide React 0.244.0
- **Backend:** Supabase 2.24.0

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── AboutSection.jsx
│   ├── BlogSection.jsx
│   ├── BookingSection.jsx
│   ├── CircuitBackground.jsx
│   ├── ContactSection.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── Navigation.jsx
│   ├── ProjectsSection.jsx
│   └── ServicesSection.jsx
├── lib/                # Utility libraries
│   └── supabase.js
├── assets/             # Static assets
├── App.jsx            # Main app component
├── App.css            # Global styles
├── index.css          # Tailwind CSS imports
└── main.jsx           # Entry point
```

## Development

This project follows modern React best practices with:
- Functional components with hooks
- Component-based architecture
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- TypeScript-ready structure

## Deployment

The project can be deployed as a static site to any hosting platform that supports static files (Vercel, Netlify, GitHub Pages, etc.).

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software owned by NANI TECH.
