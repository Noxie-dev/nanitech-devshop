# NANI TECH DevShop

A cutting-edge, AI-powered software development portfolio and service platform built with modern web technologies. This platform showcases our expertise in web development, mobile applications, SaaS solutions, and AI integration through an interactive, responsive, and visually stunning user experience.

## 🚀 Overview

NANI TECH DevShop is a comprehensive digital platform that demonstrates our capabilities in modern software development. The platform features a sophisticated design system, interactive project showcases, and seamless user experience across all devices.

## ✨ Key Features

### 🎯 Core Functionality
- **Multi-Page Architecture**: Seamless navigation between Home, About, Projects, and Contact pages
- **Interactive Project Showcase**: Dynamic slideshow with pause/play controls and category filtering
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Glassmorphism design with smooth animations and transitions
- **AI Integration Focus**: Highlighting our expertise in artificial intelligence and machine learning

### 🎮 Interactive Elements
- **Dynamic Slideshow**: 6-second interval image carousel with pause/play functionality
- **Category Filtering**: Real-time project filtering by technology stack
- **Hover Effects**: Sophisticated animations and visual feedback
- **Smooth Transitions**: Framer Motion-powered animations throughout the platform

### 📱 Mobile-First Design
- **Responsive Navigation**: Collapsible mobile menu with smooth animations
- **Touch-Friendly Interface**: Optimized for touch interactions
- **Adaptive Layout**: Grid systems that adapt to different screen sizes
- **Performance Optimized**: Fast loading and smooth scrolling on all devices

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18.2.0**: Modern React with hooks and functional components
- **Vite 4.3.9**: Lightning-fast build tool and development server
- **Tailwind CSS 3.3.2**: Utility-first CSS framework for rapid UI development
- **Framer Motion 10.12.16**: Production-ready motion library for React
- **React Router DOM 7.8.2**: Declarative routing for React applications

### Development Tools
- **Lucide React 0.244.0**: Beautiful, customizable SVG icons
- **ESLint 8.45.0**: Code linting and quality assurance
- **PostCSS 8.4.24**: CSS post-processing
- **Autoprefixer 10.4.14**: Automatic vendor prefixing

### Backend Integration
- **Supabase 2.24.0**: Backend-as-a-Service for database and authentication
- **pnpm**: Fast, disk space efficient package manager

## 🎨 Detailed Color Scheme

### Primary Color Palette

#### **Cyan Accent Colors**
```css
/* Primary Cyan */
--cyan-primary: #00E5FF
--cyan-secondary: #00A5CC
--cyan-tertiary: #0066CC

/* Usage: Primary actions, highlights, active states */
```

#### **Red Accent Colors**
```css
/* Primary Red */
--red-primary: #E53935
--red-secondary: #D32F2F
--red-tertiary: #FF6B6B

/* Usage: Secondary actions, featured elements, warnings */
```

#### **Background Colors**
```css
/* Dark Theme Backgrounds */
--bg-primary: #0C0F16    /* Main background */
--bg-secondary: #1C1F27  /* Card backgrounds */
--bg-tertiary: #14273D   /* Gradient backgrounds */

/* Usage: Layered background system for depth */
```

#### **Text Colors**
```css
/* Text Hierarchy */
--text-primary: #EAEAEA     /* Main text */
--text-secondary: #EAEAEA/70 /* Secondary text */
--text-tertiary: #EAEAEA/60  /* Tertiary text */
--text-muted: #EAEAEA/50     /* Muted text */

/* Usage: Clear text hierarchy and readability */
```

### Color Usage Guidelines

#### **Interactive Elements**
- **Primary Buttons**: Cyan gradient (`#00E5FF` to `#0066CC`)
- **Secondary Buttons**: Red gradient (`#E53935` to `#FF6B6B`)
- **Hover States**: Lighter shades with glow effects
- **Active States**: Full opacity with shadow effects

#### **Visual Hierarchy**
- **Headings**: Gradient text effects using primary colors
- **Links**: Cyan color with hover transitions
- **Borders**: Subtle cyan/red accents with transparency
- **Shadows**: Colored shadows matching accent colors

#### **Accessibility Considerations**
- **Contrast Ratios**: All text meets WCAG AA standards
- **Color Independence**: Information not conveyed by color alone
- **Focus States**: Clear visual indicators for keyboard navigation
- **Dark Theme**: Optimized for low-light environments

## 📁 Project Structure

```
NaniTeck_DevShop/
├── public/                    # Static assets
│   ├── header-logo.png       # Company logo
│   ├── hero-image.png        # Hero section image
│   └── TickTechToe-media/    # Project screenshots
│       ├── Screenshot 2025-09-10 at 17.54.41.png
│       ├── Screenshot 2025-09-10 at 17.55.14.png
│       └── ... (8 total screenshots)
├── src/
│   ├── components/           # React components
│   │   ├── AboutSection.jsx  # Company information and team
│   │   ├── ContactSection.jsx # Contact form and information
│   │   ├── Footer.jsx        # Site footer
│   │   ├── HeroSection.jsx   # Landing hero section
│   │   ├── Navigation.jsx    # Site navigation
│   │   ├── ProjectsSection.jsx # Project showcase
│   │   └── ServicesSection.jsx # Services overview
│   ├── pages/               # Page components
│   │   ├── AboutPage.jsx    # About page
│   │   ├── ContactPage.jsx  # Contact page
│   │   ├── HomePage.jsx     # Home page
│   │   └── ProjectsPage.jsx # Projects page
│   ├── lib/                 # Utility libraries
│   │   └── supabase.js      # Supabase configuration
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles
│   ├── index.css            # Tailwind CSS imports
│   └── main.jsx             # Application entry point
├── dist/                    # Production build output
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── README.md               # Project documentation
```

## 🎮 Projects Page - Detailed Overview

### **Interactive Project Showcase**

The Projects page (`/projects`) is a sophisticated showcase system that demonstrates our development capabilities through an interactive, filterable portfolio.

#### **Core Features**

##### **1. Dynamic Category Filtering**
```javascript
const categories = [
  { id: 'all', name: 'All Projects', icon: <Code2 /> },
  { id: 'web', name: 'Web Apps', icon: <Globe /> },
  { id: 'mobile', name: 'Mobile', icon: <Smartphone /> },
  { id: 'ai', name: 'AI/ML', icon: <Brain /> },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad2 /> }
];
```

- **Real-time Filtering**: Instant project filtering based on selected category
- **Visual Feedback**: Active category highlighting with gradient backgrounds
- **Smooth Transitions**: Animated transitions between filtered results
- **Icon Integration**: Category-specific icons for visual identification

##### **2. Advanced Slideshow System**

The Tic-Tac-Toe AI project features a sophisticated slideshow implementation:

```javascript
// Slideshow Configuration
const ticTacToeImages = [
  "/TickTechToe-media/Screenshot 2025-09-10 at 17.54.41.png",
  // ... 8 total screenshots
];

// 6-second interval with pause/play functionality
useEffect(() => {
  if (isSlideshowPaused) return;
  
  const interval = setInterval(() => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === ticTacToeImages.length - 1 ? 0 : prevIndex + 1
    );
  }, 6000);
  
  return () => clearInterval(interval);
}, [isSlideshowPaused]);
```

**Slideshow Features:**
- **Automatic Cycling**: 6-second intervals between images
- **Pause/Play Control**: Click anywhere on the image to toggle
- **Visual Indicators**: Progress dots showing current image
- **Smooth Animations**: Fade and scale transitions between images
- **Full Image Display**: `object-contain` ensures complete image visibility

##### **3. Project Card System**

Each project is displayed in a sophisticated card component:

```javascript
const projectStructure = {
  id: 7,
  title: "Tic-Tac-Toe AI",
  category: "gaming",
  description: "Modern Tic-Tac-Toe game with AI opponents...",
  image: "slideshow", // Special slideshow identifier
  technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
  status: "Completed",
  demoUrl: "#",
  githubUrl: "https://github.com/Noxie-dev/Tic-Tech-Toe-AI-To-The-Bone",
  featured: true
};
```

**Card Features:**
- **Featured Badge**: Red gradient badge for highlighted projects
- **Status Indicators**: Color-coded completion status
- **Technology Tags**: Visual tech stack representation
- **Interactive Overlays**: Hover effects with action buttons
- **Responsive Design**: Adaptive layout for all screen sizes

##### **4. Interactive Elements**

**Hover Effects:**
- **Card Elevation**: 10px lift on hover
- **Border Highlighting**: Cyan border color change
- **Action Button Reveal**: Demo and GitHub buttons appear
- **Title Color Change**: Dynamic text color transitions

**Click Interactions:**
- **Slideshow Control**: Pause/play functionality
- **External Links**: Direct navigation to demos and repositories
- **Category Filtering**: Instant project filtering

##### **5. Animation System**

**Framer Motion Integration:**
```javascript
// Staggered entrance animations
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: idx * 0.1 }}

// Hover animations
whileHover={{ y: -10, scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Slideshow transitions
initial={{ opacity: 0, scale: 1.1 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
```

**Animation Features:**
- **Staggered Loading**: Sequential card appearance
- **Smooth Transitions**: 300ms duration for all interactions
- **Performance Optimized**: Hardware-accelerated transforms
- **Accessibility**: Respects user motion preferences

### **Technical Implementation**

#### **State Management**
```javascript
const [activeCategory, setActiveCategory] = useState('all');
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isSlideshowPaused, setIsSlideshowPaused] = useState(false);
```

#### **Performance Optimizations**
- **Viewport-based Animations**: Only animate visible elements
- **Efficient Re-renders**: Optimized React keys and state updates
- **Image Optimization**: Proper image loading and caching
- **Memory Management**: Proper cleanup of intervals and event listeners

#### **Accessibility Features**
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant color combinations

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 16 or higher
- **pnpm**: Recommended package manager (or npm)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NaniTeck_DevShop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5174` (or the port shown in terminal)

### Available Scripts

```bash
# Development
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run lint         # Run ESLint

# Package Management
pnpm install          # Install dependencies
pnpm update           # Update dependencies
```

## 🎯 Development Guidelines

### Code Standards
- **Functional Components**: Use React hooks and functional components
- **Component Architecture**: Modular, reusable component design
- **TypeScript Ready**: Structure prepared for TypeScript migration
- **ESLint Configuration**: Enforced code quality standards

### Styling Guidelines
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first methodology
- **Component Isolation**: Scoped styles and consistent naming
- **Design System**: Consistent color and spacing usage

### Performance Best Practices
- **Code Splitting**: Route-based code splitting with React Router
- **Image Optimization**: Proper image formats and lazy loading
- **Bundle Optimization**: Vite's built-in optimizations
- **Animation Performance**: Hardware-accelerated CSS transforms

## 🚀 Deployment

### Production Build
```bash
pnpm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Static site hosting with form handling
- **GitHub Pages**: Free hosting for open source projects
- **AWS S3**: Scalable static website hosting

### Environment Configuration
```bash
# Production environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow coding standards and guidelines
4. **Test thoroughly**: Ensure all functionality works correctly
5. **Submit a pull request**: Provide detailed description of changes

### Code Review Process
- **Automated Testing**: ESLint and build verification
- **Manual Review**: Code quality and functionality review
- **Design Review**: UI/UX consistency check
- **Performance Review**: Bundle size and performance impact

## 📄 License

This project is proprietary software owned by NANI TECH. All rights reserved.

## 📞 Support

For technical support or business inquiries:
- **Email**: hello@nanitech.dev
- **Website**: https://nanitech.dev
- **GitHub**: https://github.com/Noxie-dev

---

**Built with ❤️ by the NANI TECH team**