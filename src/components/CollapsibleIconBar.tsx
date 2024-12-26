"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// You can pick any icon you like; MoreHorizontal is a common one for "overflow menu".
import { MoreHorizontal, LucideIcon } from "lucide-react";

interface CollapsibleIconBarProps {
  /** 
   * The children can be any buttons, icons, or components 
   * you currently place in the top left or top right corners 
   * (e.g., JSON dialog button, time dialog button, LLM button, etc.).
   **/
  children: React.ReactNode;
  /** 
   * Optional icon to use for the collapse button.
   * Defaults to MoreHorizontal if not provided.
   */
  icon?: LucideIcon;
}

/**
 * This component displays children inline (row) when there's 
 * enough horizontal space (i.e. at md: breakpoint or larger).
 * Otherwise, it collapses them behind a single "more" button 
 * that, when clicked, shows them in a dropdown (popover).
 */
export function CollapsibleIconBar({ children, icon: Icon = MoreHorizontal }: CollapsibleIconBarProps) {
  return (
    <div className="flex items-center">
      {/* 
        For larger screens (md and up), we show the children in a row. 
        This is the current, normal layout. 
      */}
      <div className="hidden md:flex gap-2">
        {children}
      </div>

      {/* 
        For smaller screens, we show a single button. 
        Clicking opens a popover menu with the children. 
      */}
      <div className="flex md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icon className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" side="bottom" className="p-2 w-fit">
            {/* 
              Place the children in a vertical stack (or row if desired).
              You can style as you see fit. 
            */}
            <div className="flex flex-col space-y-2">
              {children}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}