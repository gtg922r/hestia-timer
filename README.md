# <img src="./doc/hestia timer.png" alt="Hestia Timer Interface" height="30"/> Hestia Timer
Hosted on Github Pages at [Hestia Timer](https://gtg922r.github.io/hestia-timer/)
<img align="right" src="./doc/Example%20Screenshot.png" alt="Hestia Timer Interface" width="300"/>

A sleek and intuitive cooking timer application built with Next.js that helps you manage complex recipes with multiple steps and timing requirements. Perfect for coordinating multi-step cooking processes with precise timing.

### Features

- ⏰ Smart countdown timer with target time synchronization
- ✅ Interactive recipe checklist with completion tracking
- 🎯 Target time setting with automatic next-day rollover
- 🎨 Category-based step coloring
- 🔄 Dynamic step progression with time-based opacity
- 🌓 Dark/Light mode theme switching
- ⚡ Real-time step updates and remaining time calculations
- 📱 Responsive card-based UI design

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) with React 
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React icons
- **State Management**: React hooks (useState, useEffect)

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Component Structure

The application is built around a main `Recipe` component that handles:
- Timer state management
- Step progression tracking
- Theme switching
- Completion status
- Target time calculations

## License

MIT
