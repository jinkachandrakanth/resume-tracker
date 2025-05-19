
"use client";

import React from "react"; // Ensure React is imported
import { format } from "date-fns";
import { FilePenLine, Trash2, Link2, Info, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ResumeEntry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";

interface ResumeTableRowProps {
  entry: ResumeEntry;
  onEdit: (entry: ResumeEntry) => void;
  onDelete: (entry: ResumeEntry) => void;
  onValidateLink: (entry: ResumeEntry) => void;
  isMobileView: boolean;
}

export function ResumeTableRow({ entry, onEdit, onDelete, onValidateLink, isMobileView }: ResumeTableRowProps) {
  const getValidationStatusBadge = () => {
    switch (entry.validationStatus) {
      case "validating":
        return <Badge variant="secondary" className="animate-pulse"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Validating...</Badge>;
      case "valid":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle className="mr-1 h-3 w-3" />Valid</Badge>;
      case "invalid":
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Invalid</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Error</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const commonContent = (
    <>
      <div className={isMobileView ? "mb-2" : ""}>
        {isMobileView && <span className="font-semibold mr-2">Company:</span>}
        <span className={isMobileView ? "" : "font-medium"}>{entry.companyName}</span>
      </div>

      <div className={isMobileView ? "mb-2 flex items-center" : ""}>
        {isMobileView && <span className="font-semibold mr-2 shrink-0">Resume Link:</span>}
        <a
          href={entry.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-primary hover:underline truncate break-all ${isMobileView ? "min-w-0" : "max-w-[200px] inline-block"}`}
        >
          {entry.resumeLink}
        </a>
      </div>

      <div className={isMobileView ? "mb-2" : ""}>
        {isMobileView && <span className="font-semibold mr-2">Date:</span>}
        {format(new Date(entry.registrationDate), "MMM d, yyyy")}
      </div>

      <div className={isMobileView ? "mb-2" : ""}>
        {isMobileView && <span className="font-semibold mr-2">Stipend (INR):</span>}
        ₹{entry.stipend.toLocaleString()}
      </div>
      
      <div className={isMobileView ? "mb-3 flex items-center" : "flex items-center space-x-2"}>
        {isMobileView && <span className="font-semibold mr-2">Status:</span>}
        {getValidationStatusBadge()}
        {entry.validationResult?.linkValidationTips && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <Info className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 z-50"> {/* Added z-index for popover content */}
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Validation Tips</h4>
                <p className="text-sm text-muted-foreground">
                  {entry.validationResult.linkValidationTips}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  );

  const actionsContent = (
     <TooltipProvider>
      <div className={`flex space-x-2 ${isMobileView ? "justify-start mt-2" : "justify-end"}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onValidateLink(entry)}
              disabled={entry.validationStatus === 'validating'}
              aria-label="Validate Link"
            >
              {entry.validationStatus === 'validating' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Validate Resume Link</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => onEdit(entry)} aria-label="Edit Entry">
              <FilePenLine className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Entry</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={() => onDelete(entry)} aria-label="Delete Entry">
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Entry</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  if (isMobileView) {
    return (
      <div className="block p-4 mb-4 border rounded-lg shadow-md bg-card text-card-foreground">
        {commonContent}
        {actionsContent}
      </div>
    );
  }

  return (
    <TableRow key={entry.id}>
      <TableCell className="font-medium">{entry.companyName}</TableCell>
      <TableCell>
        <a
          href={entry.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline truncate max-w-[200px] inline-block"
        >
          {entry.resumeLink}
        </a>
      </TableCell>
      <TableCell>{format(new Date(entry.registrationDate), "MMM d, yyyy")}</TableCell>
      <TableCell>₹{entry.stipend.toLocaleString()}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {getValidationStatusBadge()}
          {entry.validationResult?.linkValidationTips && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Validation Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    {entry.validationResult.linkValidationTips}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {actionsContent}
      </TableCell>
    </TableRow>
  );
}

