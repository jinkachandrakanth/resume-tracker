"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
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
    <div className="mt-8 overflow-x-auto rounded-lg border shadow-sm">
      <Table>
        <TableCaption>A list of your tracked resume submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Company</TableHead>
            <TableHead>Resume Link</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[120px]">Stipend</TableHead>
            <TableHead className="w-[180px]">Validation Status</TableHead>
            <TableHead className="text-right w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <ResumeTableRow
              key={entry.id}
              entry={entry}
              onEdit={onEdit}
              onDelete={onDelete}
              onValidateLink={onValidateLink}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
