# Architecture and Design Spec

This document provides an overview of the application's architecture, including its file layout, data flow, and major components. It is intended to help new developers quickly understand how the system is structured and how data moves throughout the app.

---

## 1. Overview

This application is a cooking timer built with Next.js and TypeScript. The user can view the current step in a recipe, check off completed steps, and customize the recipe steps using a JSON editor. The app also allows setting a target completion time and optionally plays a notification sound when a step is reached.

Key Features:
• Interactive timer that counts down to a target completion time.  
• A list of recipe steps that trigger sound notifications when each step's time arrives.  
• Ability to pause/reset the timer and enable/disable sound notifications.  
• Option to switch between light mode and dark mode automatically based on system preference or manual toggle.  
• JSON-based editor for updating the recipe.  
• LLM Prompt Builder for converting text recipes into the app's JSON format.

---

## 2. File Layout

Below is a high-level overview of the main files and folders relevant to the app:

1. **src/app/layout.tsx**  
   • Root layout component for Next.js.  
   • Configures fonts, metadata, and the overall HTML body structure.  
   • Renders a <Toaster> component at a global level for toast notifications.  

2. **src/app/page.tsx**  
   • The default Home page in this Next.js app.  
   • Minimal: it currently only imports and renders the <StepTimer> component within a <main> element.  

3. **src/components/StepTimer.tsx**  
   • The primary logic for the cooking timer.  
   • Contains state management for the list of steps (both default or user-updated), dark mode toggling, sound notifications, JSON editing, and the main countdown logic.  
   • Organizes the user interface with a card-based design using the styled UI components from /ui directory.  

4. **src/components/LLMPromptBuilder.tsx**
   • Implements the LLM Prompt Builder feature.
   • Allows users to build prompts for converting text recipes to JSON format.
   • Manages a list of recipe entries with title and content.
   • Provides an editable prompt template for customizing the LLM instructions.
   • Handles copying the final formatted prompt to clipboard.

5. **src/components/ui/**  
   • Collection of small, reusable UI components such as <Button>, <Input>, <Checkbox>, <Textarea>, etc.  
   • Also includes a <Toaster> and related hooks for providing toast notifications.  

6. **public/**  
   • Public static assets (images, audio, etc.).  
   • Contains the audio file notification.wav which is fetched by the timer for step notifications.  

7. **doc/**
   • Documentation for the app architecture and features.
   • Includes App Architecture.md and Feature Spec - LLM Prompt Builder.md.

8. **Other Files**  
   • tailwind.config.ts, postcss.config.mjs, and src/app/globals.css for styling and utility classes.  
   • package.json and package-lock.json for dependency management.  
   • tsconfig.json for TypeScript configuration.  

---

## 3. Data Flow

1. **Initialization**  
   • The timer uses a default set of steps (an array of objects containing time, category, and description).  
   • These are displayed in a list grouped by upcoming/current/previous status.

2. **User Interaction**  
   • Users can start, pause, or reset the timer.  
   • Users can click on a step to mark it as completed.  
   • A user can edit the recipe steps by opening a JSON dialog. The app parses and validates the input, then refreshes the step list if valid.  
   • A user can set a new target completion time, which recalculates the countdown.  

3. **Countdown**  
   • Once started, the timer decrements every second using setInterval (or by computing time difference relative to the target time).  
   • When the countdown crosses a step's time threshold, a toast and (optionally) a sound alert are triggered.  

4. **Sound Playback**  
   • A custom hook initializes an AudioContext (on user interaction) and fetches the public/notification.wav file.  
   • The sound is played once a step threshold is reached, if sound is enabled.  

5. **Dark Mode**  
   • The app detects system preferences and toggles .dark CSS class on the <html> element to switch to dark mode.  
   • The user can also toggle dark mode manually via the interface.  

---

## 4. Major Components and Interfaces

### 4.1 Root Layout (src/app/layout.tsx)

• Function:  
  export default function RootLayout({ children }: { children: React.ReactNode })

• Responsibilities:  
  1. Defines global HTML structure, including <html> and <body>.  
  2. Applies global fonts via localFont from next/font/local.  
  3. Includes the <Toaster> component to allow global toast notifications.  
  4. Exports Next.js metadata for SEO (title and description).  

### 4.2 Home Page (src/app/page.tsx)

• Function:  
  export default function Home()  

• Responsibilities:  
  1. Displays the <StepTimer> component in a minimal layout.  
  2. Could serve as a top-level container for future expansions like navigation or app-wide context.  

### 4.3 StepTimer (src/components/StepTimer.tsx)

• Types:  
  interface Step {  
    time: number;  
    category: string;  
    description: string;  
    id: string;  
  }

• Custom Hook:  
  const useStepSound = () => { … }

  - Returns soundEnabled (boolean), playSound (function), toggleSound (function).  
  - Initializes an audio context for playing notification.wav from the public folder.  

• Main Component:  
  const Recipe = () => { … }  
  export default Recipe;

• Responsibilities:  
  1. Loads an array of Step objects which contain the time (minutes), category, description, and generated ID.  
  2. Manages the primary state for the timer:  
     – Time remaining: timeRemaining (in seconds).  
     – Whether the timer is running (isRunning) or paused.  
     – Which steps have been completed (completedSteps).  
     – Dark mode (isDarkMode).  
     – Sound notifications (soundEnabled).  
  3. Renders a list of steps that appear in upcoming, current, and previous sections depending on the remaining time and step durational logic.  
  4. Allows JSON-based editing of steps by providing an inline text editor (Textarea).  
  5. Uses the React Context for toast notifications from useToast().  

### 4.4 UI Library (src/components/ui/)

• Example UI Components:  
  1. <Button>  
  2. <Input>  
  3. <Checkbox>  
  4. <Textarea>  
  5. <Toaster>  
  6. <Dialog> (and related sub-components)  

• These components provide a consistent design language and allow for quick styling in a modular way.

### 4.5 LLMPromptBuilder (src/components/LLMPromptBuilder.tsx)

• Types:  
  interface RecipeEntry {  
    id: string;  
    title: string;  
    content: string;  
  }

• State Management:
  - Manages recipe entries with title and content
  - Handles editing and deleting entries
  - Maintains an editable prompt template
  - Controls dialog visibility and form states

• Key Features:
  1. Editable prompt template with markdown formatting
  2. Add/edit/delete recipe entries
  3. Expandable recipe content on hover
  4. Copy formatted prompt to clipboard
  5. Dark mode compatibility
  6. Toast notifications for user feedback

• Integration:
  - Integrated into StepTimer component
  - Accessible via sparkle icon in top-left corner
  - Uses shared UI components and styling

---

## 5. Future Considerations

1. **Persistent Storage**  
   • Currently, steps are stored in local component state. Future work could integrate localStorage or an external database.  

2. **User Authentication**  
   • Not implemented in this app, but could be added to save or share custom timers.  

3. **Full CRUD for Steps**  
   • Currently, the steps array is replaced via the JSON import or set as default. Another approach is to give a direct UI for adding/removing steps.  

4. **Responsive Design**  
   • The UI is largely responsive thanks to Tailwind CSS classes, but additional testing can be done for small screens or tablets.  

---

## 6. Conclusion

This application is a simple yet extensible cooking timer built with Next.js, TypeScript, and Tailwind CSS. Its main logic is contained in the <StepTimer> component, which manages time, user interactions, and notifications. The architecture is deliberately modular, allowing features to be extended or modified with minimal impact on unrelated components.
