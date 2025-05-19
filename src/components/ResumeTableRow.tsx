
"use client";

import React from "react";
import { format } from "date-fns";
import { FilePenLine, Trash2, Eye, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ResumeEntry } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";


interface ResumeTableRowProps {
  entry: ResumeEntry;
  onEdit: (entry: ResumeEntry) => void;
  onDelete: (entry: ResumeEntry) => void;
  onViewNote: (entry: ResumeEntry) => void;
  isMobileView: boolean;
  isSelected: boolean;
  onSelectEntry: (checked: boolean) => void;
}

export function ResumeTableRow({
  entry,
  onEdit,
  onDelete,
  onViewNote,
  isMobileView,
  isSelected,
  onSelectEntry,
}: ResumeTableRowProps) {

  const commonContentForMobile = ( // Renamed to be specific for mobile, desktop is structured directly
    <>
      <div className={cn("flex items-center", isMobileView ? "mb-2" : "")}>
         {isMobileView && <div className="w-8"> {/* Spacer for mobile checkbox alignment */} </div>}
        <div className="flex-grow min-w-0">
          <div className={isMobileView ? "mb-1" : ""}>
            {isMobileView && <span className="font-semibold mr-2">Company:</span>}
            <span className={isMobileView ? "" : "font-medium"}>{entry.companyName}</span>
          </div>

          <div className={cn("flex items-center", isMobileView ? "mb-1" : "")}>
            {isMobileView && <span className="font-semibold mr-2 shrink-0">Resume Link:</span>}
            <a
              href={entry.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-primary hover:underline truncate", 
                isMobileView ? "min-w-0 flex-1" : "max-w-[200px] inline-block" 
              )}
            >
              {entry.resumeLink}
            </a>
          </div>

          <div className={isMobileView ? "mb-1" : ""}>
            {isMobileView && <span className="font-semibold mr-2">Date:</span>}
            {format(new Date(entry.registrationDate), "MMM d, yyyy")}
          </div>

          <div className={isMobileView ? "mb-1" : ""}>
            {isMobileView && <span className="font-semibold mr-2">Stipend (INR):</span>}
            ₹{entry.stipend.toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );

  const actionsContentDesktop = (
    <TooltipProvider>
      <div className="flex space-x-1 justify-end">
        {(entry.note || entry.image) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onViewNote(entry)} aria-label="View Note">
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>View Note/Image</p></TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onEdit(entry)} aria-label="Edit Entry">
              <FilePenLine className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Edit Entry</p></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onDelete(entry)} aria-label="Delete Entry" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Delete Entry</p></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const actionsContentMobile = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(entry.note || entry.image) && (
          <DropdownMenuItem onClick={() => onViewNote(entry)}>
            <Eye className="mr-2 h-4 w-4" /> View Note/Image
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onEdit(entry)}>
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(entry)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (isMobileView) {
    return (
      <div className={cn("flex items-start p-3 mb-2 border rounded-lg shadow-sm bg-card text-card-foreground", isSelected && "ring-2 ring-primary border-primary")}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectEntry(!!checked)}
          aria-label={`Select row for ${entry.companyName}`}
          className="mr-3 mt-1 shrink-0"
          id={`checkbox-${entry.id}`}
        />
        <div className="flex-grow min-w-0">
          {commonContentForMobile}
        </div>
        <div className="ml-auto shrink-0">
         {actionsContentMobile}
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <TableRow key={entry.id} data-state={isSelected ? "selected" : undefined}>
      <TableCell className="px-2 py-2 w-[50px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectEntry(!!checked)}
          aria-label={`Select row for ${entry.companyName}`}
        />
      </TableCell>
      <TableCell className="font-medium w-[200px]">{entry.companyName}</TableCell>
      <TableCell className="max-w-[250px]"> {/* Adjusted to match header spec if it was 250px */}
        <a
          href={entry.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline truncate inline-block"
        >
          {entry.resumeLink}
        </a>
      </TableCell>
      <TableCell className="w-[150px]">{format(new Date(entry.registrationDate), "MMM d, yyyy")}</TableCell>
      <TableCell className="w-[120px]">₹{entry.stipend.toLocaleString()}</TableCell>
      <TableCell className="text-right w-[180px]">
        {actionsContentDesktop}
      </TableCell>
    </TableRow>
  );
}
