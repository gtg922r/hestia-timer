"use client";
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Moon, Sun, Clock, List, Check as CheckIcon } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Step {
  time: number;
  category: string;
  description: string;
  id: string;
}

// Add color palette and category color mapping
const CATEGORY_COLORS = {
  light: [
    'text-red-600',
    'text-blue-600',
    'text-green-600',
    'text-purple-600',
    'text-orange-600',
    'text-teal-600',
    'text-pink-600',
    'text-indigo-600',
  ],
  dark: [
    'dark:text-red-400',
    'dark:text-blue-400',
    'dark:text-green-400',
    'dark:text-purple-400',
    'dark:text-orange-400',
    'dark:text-teal-400',
    'dark:text-pink-400',
    'dark:text-indigo-400',
  ]
};

const Recipe = () => {
  const { toast } = useToast();
  
  const defaultSteps = [
    { time: 45, category: 'Chicken', description: 'Pre-heat grill' },
    { time: 30, category: 'Chicken', description: 'Place hens skin side up directly over coals' },
    { time: 26, category: 'Gravy', description: 'Melt 4tbsp butter over medium-high heat' },
    { time: 25, category: 'Chicken', description: 'Flip skin-side down' },
    { time: 23, category: 'Gravy', description: 'When foaming subsides, add shallots' },
    { time: 17, category: 'Gravy', description: 'Whisk in flour' },
    { time: 15, category: 'Gravy', description: 'add in stock and 1 cup wine' },
    { time: 10, category: 'Chicken', description: 'Pull chicken when breast register 145-150F. Set to rest' },
    { time: 0, category: 'Gravy', description: 'Whisk in mustard and honey. Season with salt and pepper to taste' },
    { time: 0, category: 'Chicken', description: 'Carve' }
  ].map(step => ({ ...step, id: Math.random().toString(36).substr(2, 9) }));

  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [showJsonDialog, setShowJsonDialog] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const TOTAL_MINUTES = Math.max(...steps.map(step => step.time));
  
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [targetTime, setTargetTime] = useState<Date | null>(null);
  const [showTargetDialog, setShowTargetDialog] = useState(false);
  const [categoryColorMap, setCategoryColorMap] = useState<Map<string, number>>(new Map());

  // Initialize dark mode from system preference
  useEffect(() => {
    // Check if the system prefers dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update category color mapping when steps change
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(steps.map(step => step.category)));
    const newColorMap = new Map();
    uniqueCategories.forEach((category, index) => {
      newColorMap.set(category, index % CATEGORY_COLORS.light.length);
    });
    setCategoryColorMap(newColorMap);
  }, [steps]);

  // Add effect to handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize with default target time (45 minutes from now)
  useEffect(() => {
    if (!targetTime) {
      const defaultTarget = new Date();
      defaultTarget.setMinutes(defaultTarget.getMinutes() + TOTAL_MINUTES);
      setTargetTime(defaultTarget);
    }
  }, [targetTime, TOTAL_MINUTES]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        if (targetTime) {
          const now = new Date();
          const diffSeconds = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));
          setTimeRemaining(diffSeconds);
        } else {
          setTimeRemaining(prev => Math.max(0, prev - 1));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeRemaining, targetTime]);

  const handleTargetTimeChange = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newTarget = new Date();
    newTarget.setHours(hours, minutes, 0, 0);
    
    // If the time is earlier today, assume it's for tomorrow
    if (newTarget < new Date()) {
      newTarget.setDate(newTarget.getDate() + 1);
    }
    
    setTargetTime(newTarget);
    const now = new Date();
    setTimeRemaining(Math.max(0, Math.floor((newTarget.getTime() - now.getTime()) / 1000)));
    setShowTargetDialog(false);
  };

  const formatTimeInput = (date: Date | null) => {
    if (!date) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // Rest of the component logic...
  const getCurrentStep = () => {
    const currentMinute = Math.ceil(timeRemaining / 60);
    const currentIndex = steps.findIndex((step, index) => {
      const nextStep = steps[index + 1];
      return step.time >= currentMinute && (!nextStep || nextStep.time < currentMinute);
    });
    return currentIndex;
  };

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return 'Now!';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentStepIndex = getCurrentStep();
  const currentStep = steps[currentStepIndex];
  const nextSteps = isExpanded 
    ? steps.slice(currentStepIndex + 1) 
    : steps.slice(currentStepIndex + 1, currentStepIndex + 4);
  const remainingStepsCount = Math.max(0, steps.length - (currentStepIndex + 4));

  const getTimeUntilStep = (step: Step | null) => {
    if (!step) return 0;
    const stepTimeInSeconds = step.time * 60;
    return Math.max(0, timeRemaining - stepTimeInSeconds);
  };

  const resetTimer = () => {
    const defaultTarget = new Date();
    defaultTarget.setMinutes(defaultTarget.getMinutes() + TOTAL_MINUTES);
    setTargetTime(defaultTarget);
    setTimeRemaining(TOTAL_MINUTES * 60);
    setIsRunning(false);
  };

  const toggleStepCompletion = (stepId: string, event?: React.MouseEvent) => {
    // Prevent the click from triggering the parent div's onClick
    if (event) {
      event.stopPropagation();
    }
    
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getCategoryColorClasses = (category: string) => {
    const colorIndex = categoryColorMap.get(category) ?? 0;
    return `${CATEGORY_COLORS.light[colorIndex]} ${CATEGORY_COLORS.dark[colorIndex]}`;
  };

  const renderStep = (step: Step | null, type: 'current' | 'previous' | 'next') => {
    if (!step) return null;
    const timeUntil = getTimeUntilStep(step);
    const isUpcoming = timeUntil > 0;
    const isCompleted = completedSteps.has(step.id);
    
    return (
      <div 
        onClick={() => toggleStepCompletion(step.id)}
        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 
          ${type === 'current' ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-800'}
          ${isCompleted ? 'bg-green-50 dark:bg-green-900' : ''}
          hover:bg-gray-100 dark:hover:bg-gray-700
        `}
      >
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={() => toggleStepCompletion(step.id)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="h-5 w-5"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-semibold ${getCategoryColorClasses(step.category)}`}>
                {step.category}
              </span>
              <span className={`text-sm font-mono ${
                isUpcoming 
                  ? 'text-gray-600 dark:text-gray-400' 
                  : 'text-orange-600 dark:text-orange-400 font-bold'
              }`}>
                {formatTime(timeUntil)}
              </span>
            </div>
            <p className={`text-gray-700 dark:text-gray-300 ${isCompleted ? 'line-through' : ''}`}>
              {step.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const handleJsonEdit = () => {
    // Remove IDs when showing JSON to user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stepsWithoutIds = steps.map(({ id, ...step }) => step);
    setJsonInput(JSON.stringify(stepsWithoutIds, null, 2));
    setJsonError('');
    setShowJsonDialog(true);
  };

  const handleJsonUpdate = () => {
    try {
      const parsedSteps = JSON.parse(jsonInput);
      if (!Array.isArray(parsedSteps)) {
        throw new Error('Input must be an array of steps');
      }
      
      // Validate each step has required properties
      parsedSteps.forEach((step, index) => {
        if (typeof step.time !== 'number' || 
            typeof step.category !== 'string' || 
            typeof step.description !== 'string') {
          throw new Error(`Step ${index + 1} is missing required properties`);
        }
      });

      // Always generate new IDs for all steps
      const updatedSteps = parsedSteps.map(step => ({
        ...step,
        id: Math.random().toString(36).substr(2, 9)
      }));

      setSteps(updatedSteps);
      setShowJsonDialog(false);
      setJsonError('');
      
      // Reset timer when steps are updated
      resetTimer();

      // Show success toast
      toast({
        title: "Recipe Updated",
        description: `Successfully processed ${updatedSteps.length} steps`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setJsonError(errorMessage);
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Card className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 relative">
        <div className="absolute left-4 top-4">
          <Dialog open={showJsonDialog} onOpenChange={setShowJsonDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400"
                onClick={handleJsonEdit}
              >
                <List className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Recipe Steps</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="font-mono h-[400px] overflow-auto"
                  placeholder="Paste your recipe JSON here..."
                />
                {jsonError && (
                  <p className="text-red-500 text-sm mt-2">{jsonError}</p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowJsonDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleJsonUpdate}>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Update Recipe
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <Dialog open={showTargetDialog} onOpenChange={setShowTargetDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400"
              >
                <Clock className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Target Completion Time</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="time"
                  defaultValue={formatTimeInput(targetTime)}
                  onChange={(e) => handleTargetTimeChange(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Target completion time: {targetTime?.toLocaleTimeString()}
                </p>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-500" />
            )}
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-mono font-bold mb-4 dark:text-white">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Target: {targetTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setIsRunning(!isRunning)}
              className="w-24"
            >
              {isRunning ? <Pause className="mr-2" size={20} /> : <Play className="mr-2" size={20} />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outline"
              onClick={resetTimer}
              className="w-24"
            >
              <RotateCcw className="mr-2" size={20} />
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {currentStepIndex > 0 && !isExpanded && (
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Show {currentStepIndex} previous {currentStepIndex === 1 ? 'step' : 'steps'}
            </Button>
          )}
          
          {isExpanded && currentStepIndex > 0 && steps.slice(0, currentStepIndex).map((step) => (
            <div 
              key={step.id}
              style={{ opacity: 0.5 }}
              className="transition-opacity duration-200"
            >
              {renderStep(step, 'previous')}
            </div>
          ))}
          
          {currentStep && (
            <div className="transform transition-all duration-200">
              {renderStep(currentStep, 'current')}
            </div>
          )}
          
          {nextSteps.map((step, index) => (
            <div 
              key={step.id} 
              style={{ opacity: 0.9 - (index * 0.1) }}
              className="transition-opacity duration-200"
            >
              {renderStep(step, 'next')}
            </div>
          ))}

          {!isExpanded && remainingStepsCount > 0 && (
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Show {remainingStepsCount} more {remainingStepsCount === 1 ? 'step' : 'steps'}
            </Button>
          )}

          {isExpanded && (
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(false)}
              className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Collapse all steps
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Recipe;