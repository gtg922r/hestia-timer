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
- 🔔 Optional sound notifications for step changes
- ⚡ Real-time step updates and remaining time calculations
- 📱 Responsive card-based UI design
- ✨ LLM Prompt Builder for converting text recipes to JSON format

## Technical Stack

- **Framework**: [Next.js](https://nextjs.org/) with React 
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: Custom components with shadcn/ui
- **Icons**: Lucide React icons
- **State Management**: React hooks (useState, useEffect)
- **Audio**: Web Audio API for step notifications

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

The application is built around two main components:

### Recipe Component
Handles core timer functionality:
- Timer state management
- Step progression tracking
- Theme switching
- Completion status
- Target time calculations

### LLM Prompt Builder Component
Helps convert text recipes to JSON format:
- Accessible via the sparkle (✨) icon
- Add and manage multiple recipe entries
- Edit prompt template for LLM instructions
- Copy formatted prompt to clipboard
- Expandable recipe previews with smooth animations

## Recipe Format

Recipes can be imported using a JSON format with the following structure:

```json
[
  {
    "time": 45,
    "category": "Chicken",
    "description": "Pre-heat grill"
  },
  {
    "time":40,
    "category": "Gravy",
    "description": "Melt 4tbsp butter over medium-high heat"
  }
]
```

### Recipe Step Properties

- `time` (number): Minutes from the end when this step should occur (e.g., 45 means this step happens 45 minutes before completion)
- `category` (string): Category grouping for the step, used for color-coding
- `description` (string): The instruction text for this step

Steps are automatically sorted by time in descending order, with the earliest steps (highest time value) appearing first.

## Converting Text Recipes

The LLM Prompt Builder helps convert text-based recipes into the required JSON format:

1. Click the sparkle (✨) icon in the top-left corner
2. Add one or more recipes with titles and content
3. (Optional) Customize the prompt template
4. Click "Copy Prompt to Clipboard"
5. Paste the prompt into your preferred LLM
6. Copy the resulting JSON into the app's JSON editor

The prompt builder includes:
- Markdown formatting support
- Expandable recipe previews
- Edit and delete functionality
- Dark mode support
- Toast notifications for user feedback

## Sound Notifications

The timer includes an optional sound notification system that:
- Plays a gentle alert sound when each new step begins
- Can be toggled on/off using the bell icon in the top right
- Requires user interaction before playing (browser security requirement)
- Works across all modern browsers
- Automatically adjusts to your system volume

Sound notifications are disabled by default and must be explicitly enabled by clicking the bell icon. Due to browser security policies, sound will only play after the user has interacted with the page.

## Credits

Notification sound from [akx/Notifications](https://github.com/akx/Notifications) under dual license (CC Attribution 3.0 Unported or CC0 Public Domain).

## License

MIT
