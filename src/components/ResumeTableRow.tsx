
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

  const commonContent = (
    <>
      <div className={cn("flex items-center", isMobileView ? "mb-2" : "")}>
        {!isMobileView && (
          <TableCell className="px-2 py-2 w-[50px]">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectEntry(!!checked)}
              aria-label={`Select row for ${entry.companyName}`}
            />
          </TableCell>
        )}
         {isMobileView && <div className="w-8"> {/* Spacer for mobile checkbox alignment */} </div>}
        <div className="flex-grow min-w-0"> {/* Added min-w-0 here to help with truncation */}
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
                "text-primary hover:underline truncate", // Removed break-all, rely on truncate and overflow hidden of parent
                isMobileView ? "min-w-0 flex-1" : "max-w-[200px] inline-block" // flex-1 for mobile to take available space
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
        <div className="flex-grow min-w-0"> {/* Added min-w-0 here as well */}
          {commonContent}
        </div>
        <div className="ml-auto shrink-0">
         {actionsContentMobile}
        </div>
      </div>
    );
  }

  return (
    <TableRow key={entry.id} data-state={isSelected ? "selected" : undefined}>
      {/* Checkbox is now part of commonContent for TableCell structure */}
      <TableCell className="font-medium hidden md:table-cell w-[200px]">{entry.companyName}</TableCell>
      <TableCell className="hidden md:table-cell max-w-[200px]"> {/* Ensure max-width for desktop link cell */}
        <a
          href={entry.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline truncate inline-block" // Removed max-w-[200px] from here, relying on cell's max-width
        >
          {entry.resumeLink}
        </a>
      </TableCell>
      <TableCell className="hidden md:table-cell w-[150px]">{format(new Date(entry.registrationDate), "MMM d, yyyy")}</TableCell>
      <TableCell className="hidden md:table-cell w-[120px]">₹{entry.stipend.toLocaleString()}</TableCell>
      
      {/* Merging commonContent into the cells for desktop */}
      {!isMobileView && (
        <>
            <TableCell className="px-2 py-2 w-[50px]">
                <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelectEntry(!!checked)}
                aria-label={`Select row for ${entry.companyName}`}
                />
            </TableCell>
            {/* The rest of the data cells are already defined above */}
        </>
      )}

      <TableCell className="text-right hidden md:table-cell w-[180px]">
        {actionsContentDesktop}
      </TableCell>
    </TableRow>
  );
}

