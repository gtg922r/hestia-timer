import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles, Plus, Copy, X } from 'lucide-react';

interface RecipeEntry {
  id: string;
  title: string;
  content: string;
}

const defaultPromptTemplate = 
`## Task
Please review the attached recipes. Convert each one to a series of steps in the specified JSON format. Return all the steps from all the recipes in one JSON object. 
Assume all recipes need to complete at the same time - so if one recipe takes 45 minutes, and the other takes 10 minutes, the 10 minute recipe will need to start 35 minutes into the first recipe.
Note that the time is in minutes from the end of the recipe - so if recipe step 1 is do something and wait 10 minutes, and step 2 is do something else and wait 5 minutes, the \`time\` for step 1 is 15 and the \`time\` for step 2 is 5.

## Output Specification
Please return all the steps from all the recipes in this JSON format:
\`\`\`json
[
  {
    time: number,
    category: string,
    description: string
  },
  ...
]
\`\`\`
### Recipe Step Properties
- \`time\` (number): Minutes from the end when this step should occur (e.g., 45 means this step happens 45 minutes before completion)
- \`category\` (string): Food item the step is for, used for color-coding and reference to which recipe item. Should be different for each recipe. Also if each recipe has multiple items (for example a meat dish with a sauce recipe), have two categories, one for each item. Should be human readable with capitalization, for example "Green Beans."
- \`description\` (string): The instruction text for this step`;

export function LLMPromptBuilder() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<RecipeEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingEntry, setEditingEntry] = useState<RecipeEntry | null>(null);
  const [promptTemplate, setPromptTemplate] = useState(defaultPromptTemplate);

  const handleAddEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Both title and content are required.",
      });
      return;
    }

    const newEntry: RecipeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle.trim(),
      content: newContent.trim(),
    };

    setEntries([...entries, newEntry]);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
    
    toast({
      title: "Recipe Added",
      description: `Added "${newTitle}" to the prompt builder.`,
    });
  };

  const handleEditEntry = (entry: RecipeEntry) => {
    setEditingEntry(entry);
    setNewTitle(entry.title);
    setNewContent(entry.content);
    setShowAddForm(true);
  };

  const handleUpdateEntry = () => {
    if (!editingEntry || !newTitle.trim() || !newContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Both title and content are required.",
      });
      return;
    }

    setEntries(entries.map(entry => 
      entry.id === editingEntry.id 
        ? { ...entry, title: newTitle.trim(), content: newContent.trim() }
        : entry
    ));
    
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
    setEditingEntry(null);
    
    toast({
      title: "Recipe Updated",
      description: `Updated "${newTitle}" successfully.`,
    });
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setNewTitle('');
    setNewContent('');
    setEditingEntry(null);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const generatePrompt = () => {
    if (entries.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Add at least one recipe before generating a prompt.",
      });
      return;
    }

    const prompt = [
      promptTemplate,
      "",
      "Here are the recipes to convert:",
      "",
      ...entries.map(entry => [
        `Recipe Title: ${entry.title}`,
        "````",
        entry.content,
        "````",
        ""
      ]).flat()
    ].join('\n');

    navigator.clipboard.writeText(prompt).then(() => {
      toast({
        title: "Prompt Copied",
        description: "The prompt has been copied to your clipboard.",
      });
      setIsOpen(false);
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy prompt to clipboard.",
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 dark:text-gray-400"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Recipe Prompt Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt Template</label>
            <Textarea
              value={promptTemplate}
              onChange={(e) => setPromptTemplate(e.target.value)}
              className="font-mono text-sm resize-none h-[200px]"
              placeholder="Enter the prompt template here..."
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="text-sm font-medium mb-2">Recipe Entries</div>
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg relative mb-4 group"
                onMouseEnter={(e) => {
                  const content = e.currentTarget.querySelector('[data-recipe-content]') as HTMLParagraphElement;
                  if (content) content.style.maxHeight = '200px';
                }}
                onMouseLeave={(e) => {
                  const content = e.currentTarget.querySelector('[data-recipe-content]') as HTMLParagraphElement;
                  if (content) content.style.maxHeight = '4.5em';
                }}
              >
                <div className="absolute right-2 top-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold mb-2 pr-16">{entry.title}</h3>
                <p 
                  data-recipe-content
                  className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: '4.5em' }}
                >
                  {entry.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-shrink-0 border-t pt-4">
            {showAddForm ? (
              <div className="space-y-4">
                <Input
                  placeholder="Recipe Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <div className="relative">
                  <Textarea
                    placeholder="Recipe Content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="resize-none min-h-[300px]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingEntry ? handleUpdateEntry : handleAddEntry}>
                    {editingEntry ? 'Update Recipe' : 'Add Recipe'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Recipe
              </Button>
            )}

            <Button
              className="w-full mt-4"
              onClick={generatePrompt}
              disabled={entries.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Prompt to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 