"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import type { ResumeEntry } from "@/types";
import { ResumeTableRow } from "./ResumeTableRow";
import { Checkbox } from "@/components/ui/checkbox";

interface ResumeTableProps {
  entries: ResumeEntry[];
  onEdit: (entry: ResumeEntry) => void;
  onDelete: (entry: ResumeEntry) => void;
  onViewNote: (entry: ResumeEntry) => void;
  selectedEntryIds: string[];
  onSelectEntry: (entryId: string, checked: boolean) => void;
  onSelectAllEntries: (checked: boolean) => void;
}

export function ResumeTable({
  entries,
  onEdit,
  onDelete,
  onViewNote,
  selectedEntryIds,
  onSelectEntry,
  onSelectAllEntries,
}: ResumeTableProps) {
  if (entries.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        <p>No resume entries yet. Add one to get started!</p>
      </div>
    );
  }

  const isAllSelected = entries.length > 0 && selectedEntryIds.length === entries.length;

  return (
    <div className="mt-8 md:overflow-x-auto md:rounded-lg md:border md:shadow-sm">
      {/* For larger screens, use the table layout */}
      <Table className="hidden md:table">
        <TableCaption className="hidden md:table-caption">A list of your tracked resume submissions.</TableCaption>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead className="w-[50px] px-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => onSelectAllEntries(!!checked)}
                aria-label="Select all rows"
              />
            </TableHead>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>Resume Link</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[120px]">Stipend (INR)</TableHead>
            {/* Validation Status column removed */}
            <TableHead className="text-right w-[180px]">Actions</TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody className="hidden md:table-row-group">
          {entries.map((entry) => (
            <ResumeTableRow
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewNote={onViewNote}
              isMobileView={false}
              isSelected={selectedEntryIds.includes(entry.id)}
              onSelectEntry={(checked) => onSelectEntry(entry.id, checked)}
            />
          ))}
        </TableBody>
      </Table>

      {/* For smaller screens, use the card-like layout */}
      <div className="space-y-4 md:hidden">
         <div className="flex items-center p-2 border-b">
            <Checkbox
                id="selectAllMobile"
                checked={isAllSelected}
                onCheckedChange={(checked) => onSelectAllEntries(!!checked)}
                aria-label="Select all rows"
              />
            <label htmlFor="selectAllMobile" className="ml-2 text-sm font-medium">Select All</label>
        </div>
        {entries.map((entry) => (
          <ResumeTableRow
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewNote={onViewNote}
            isMobileView={true}
            isSelected={selectedEntryIds.includes(entry.id)}
            onSelectEntry={(checked) => onSelectEntry(entry.id, checked)}
          />
        ))}
         <p className="mt-4 text-sm text-center text-muted-foreground md:hidden">A list of your tracked resume submissions.</p>
      </div>
    </div>
  );
}
