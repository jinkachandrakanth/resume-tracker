"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead, // Added TableHead for consistency, though it's hidden on mobile
} from "@/components/ui/table";
import type { ResumeEntry } from "@/types";
import { ResumeTableRow } from "./ResumeTableRow";

interface ResumeTableProps {
  entries: ResumeEntry[];
  onEdit: (entry: ResumeEntry) => void;
  onDelete: (entry: ResumeEntry) => void;
  onValidateLink: (entry: ResumeEntry) => void;
}

export function ResumeTable({ entries, onEdit, onDelete, onValidateLink }: ResumeTableProps) {
  if (entries.length === 0) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        <p>No resume entries yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 md:overflow-x-auto md:rounded-lg md:border md:shadow-sm">
      {/* For larger screens, use the table layout */}
      <Table className="hidden md:table">
        <TableCaption className="hidden md:table-caption">A list of your tracked resume submissions.</TableCaption>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>Resume Link</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[120px]">Stipend (INR)</TableHead>
            <TableHead className="w-[180px]">Validation Status</TableHead>
            <TableHead className="text-right w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="hidden md:table-row-group">
          {entries.map((entry) => (
            <ResumeTableRow
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onValidateLink={onValidateLink}
              isMobileView={false}
            />
          ))}
        </TableBody>
      </Table>

      {/* For smaller screens, use the card-like layout */}
      <div className="space-y-4 md:hidden">
        {entries.map((entry) => (
          <ResumeTableRow
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
            onValidateLink={onValidateLink}
            isMobileView={true}
          />
        ))}
         <p className="mt-4 text-sm text-center text-muted-foreground md:hidden">A list of your tracked resume submissions.</p>
      </div>
    </div>
  );
}
