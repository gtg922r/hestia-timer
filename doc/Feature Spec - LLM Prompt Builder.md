# LLM Prompt Builder - Feature Specification

## 1. Overview

The LLM Prompt Builder feature allows users to create, manage, and combine multiple recipe "entries" (each containing a title and recipe text) into a single prompt. This prompt furnishes an LLM with the necessary context for converting all these recipes into the app's JSON format.

## 2. Implementation Details

### 2.1 User Interface

1. Access Point:
   - A sparkle icon (✨) in the top-left corner of the app
   - Clicking opens the "Prompt Builder" modal dialog

2. Modal Dialog Layout:
   - Fixed width (600px) with maximum height of 90vh
   - Scrollable content area with fixed header and footer
   - Dark mode compatible styling

3. Content Sections:
   a) Prompt Template:
      - Editable textarea with monospace font
      - Contains task description and JSON format specification
      - Markdown formatting support
      - Fixed height with scrolling

   b) Recipe List:
      - Scrollable list of recipe entries
      - Each entry shows:
        • Title in bold
        • Preview of content (3 lines by default)
        • Expand on hover to show more content (up to 200px)
        • Edit and delete buttons (appear on hover)
      - Smooth animations for content expansion

   c) Add/Edit Form:
      - Input field for recipe title
      - Large textarea for recipe content (300px height)
      - Cancel and Save/Update buttons

   d) Action Buttons:
      - "Add Recipe" button when no form is shown
      - "Copy Prompt to Clipboard" button at the bottom

### 2.2 Features

1. Recipe Management:
   - Add new recipes with title and content
   - Edit existing recipes
   - Delete recipes
   - Expandable preview of recipe content

2. Prompt Template:
   - Editable markdown-formatted template
   - Includes task description and JSON format specification
   - Preserves formatting in final prompt

3. Prompt Generation:
   - Combines template with all recipes
   - Uses quadruple backticks for recipe content
   - Copies result to clipboard
   - Provides feedback via toast notifications

### 2.3 Data Model

```typescript
interface RecipeEntry {
  id: string;      // Unique identifier
  title: string;   // Recipe title
  content: string; // Recipe text content
}
```

### 2.4 User Interactions

1. Adding a Recipe:
   - Click "Add Recipe" button
   - Enter title and content
   - Click "Add Recipe" to save
   - Receive confirmation toast

2. Editing a Recipe:
   - Hover over recipe to show edit button
   - Click edit button
   - Modify title and/or content
   - Click "Update Recipe" to save
   - Receive confirmation toast

3. Deleting a Recipe:
   - Hover over recipe to show delete button
   - Click delete button
   - Entry is immediately removed

4. Viewing Recipe Content:
   - Default view shows 3 lines
   - Hover over entry to expand
   - Content smoothly animates to show more
   - Mouse leave returns to 3-line view

5. Generating Prompt:
   - Click "Copy Prompt to Clipboard"
   - Receive success/error toast
   - Dialog automatically closes on success

### 2.5 Error Handling

1. Input Validation:
   - Title and content are required
   - Empty fields show error toast
   - Form remains open on error

2. Clipboard Operations:
   - Success/failure feedback via toasts
   - Graceful handling of clipboard API errors

## 3. Technical Implementation

1. Component Structure:
   - Standalone React component (`LLMPromptBuilder.tsx`)
   - Uses shared UI components from ui/ directory
   - Integrated into StepTimer component

2. State Management:
   - Local React state for entries and UI state
   - No persistence (resets on page reload)

3. Styling:
   - Tailwind CSS for styling
   - Dark mode support
   - Responsive layout
   - Smooth transitions and animations

4. Dependencies:
   - Uses existing UI component library
   - No additional external dependencies

## 4. Future Enhancements

1. Persistence:
   - Save recipes to localStorage
   - Cloud storage integration

2. Template Management:
   - Save multiple templates
   - Template categories

3. Recipe Import/Export:
   - Bulk import/export of recipes
   - Different format support

4. Enhanced Editing:
   - Rich text editing
   - Recipe formatting tools
   - Preview in JSON format

---
