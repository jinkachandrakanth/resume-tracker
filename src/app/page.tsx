
"use client";

import * as React from "react";
import { PlusCircle, Sun, Moon, Trash2, Eye, Info } from "lucide-react";
import Image from 'next/image';
import { AppLogo } from "@/components/icons/AppLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumeTable } from "@/components/ResumeTable";
import type { ResumeEntry, ResumeFormData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox"; // For bulk delete

export default function ResuTrackPage() {
  const [resumeEntries, setResumeEntries] = React.useState<ResumeEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<ResumeEntry | undefined>(undefined);
  const [entryToDelete, setEntryToDelete] = React.useState<ResumeEntry | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = React.useState<'light' | 'dark'>('light');
  const [noteToView, setNoteToView] = React.useState<ResumeEntry | null>(null);
  const [selectedEntryIds, setSelectedEntryIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        setCurrentTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setCurrentTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  React.useEffect(() => {
    const storedEntries = localStorage.getItem("resumeEntries");
    if (storedEntries) {
      try {
        const parsedEntries = JSON.parse(storedEntries) as ResumeEntry[];
        const correctedEntries = parsedEntries.map(entry => ({
          ...entry,
          registrationDate: new Date(entry.registrationDate)
        }));
        setResumeEntries(correctedEntries);
      } catch (error) {
        console.error("Failed to parse resume entries from localStorage", error);
        setResumeEntries([]);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("resumeEntries", JSON.stringify(resumeEntries));
  }, [resumeEntries]);

  const handleFormSubmit = (data: ResumeFormData) => {
    setIsLoading(true);
    if (editingEntry) {
      setResumeEntries(
        resumeEntries.map((entry) =>
          entry.id === editingEntry.id ? { ...editingEntry, ...data, registrationDate: new Date(data.registrationDate) } : entry
        )
      );
      toast({ title: "Success!", description: "Resume entry updated." });
    } else {
      const newEntry: ResumeEntry = {
        ...data,
        id: crypto.randomUUID(),
        registrationDate: new Date(data.registrationDate),
      };
      setResumeEntries([newEntry, ...resumeEntries]);
      toast({ title: "Success!", description: "New resume entry added." });
    }
    setIsLoading(false);
    setIsFormOpen(false);
    setEditingEntry(undefined);
  };

  const handleEdit = (entry: ResumeEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleDelete = (entry: ResumeEntry) => {
    setEntryToDelete(entry);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      setResumeEntries(resumeEntries.filter((e) => e.id !== entryToDelete.id));
      toast({ variant: "destructive", title: "Deleted", description: "Resume entry removed." });
      setEntryToDelete(undefined);
    }
  };

  const handleViewNote = (entry: ResumeEntry) => {
    setNoteToView(entry);
  };

  const openAddNewForm = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  };

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    setSelectedEntryIds(prevSelectedIds =>
      checked
        ? [...prevSelectedIds, entryId]
        : prevSelectedIds.filter(id => id !== entryId)
    );
  };

  const handleSelectAllEntries = (checked: boolean) => {
    if (checked) {
      setSelectedEntryIds(resumeEntries.map(entry => entry.id));
    } else {
      setSelectedEntryIds([]);
    }
  };

  const handleDeleteSelected = () => {
    setResumeEntries(prevEntries =>
      prevEntries.filter(entry => !selectedEntryIds.includes(entry.id))
    );
    toast({ 
      variant: "destructive", 
      title: "Deleted Selected", 
      description: `${selectedEntryIds.length} resume entr${selectedEntryIds.length === 1 ? 'y' : 'ies'} removed.` 
    });
    setSelectedEntryIds([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">ResuTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Toggle theme">
              {currentTheme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingEntry(undefined); }}>
              <DialogTrigger asChild>
                <Button onClick={openAddNewForm}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEntry ? "Edit" : "Add New"} Resume Entry</DialogTitle>
                  <DialogDescription>
                    {editingEntry ? "Update the details of your resume submission." : "Fill in the details of your new resume submission."}
                  </DialogDescription>
                </DialogHeader>
                <ResumeForm
                  onSubmit={handleFormSubmit}
                  initialData={editingEntry}
                  isEditing={!!editingEntry}
                  isLoading={isLoading}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Your Resume Submissions</CardTitle>
            <CardDescription>
              Track and manage your job applications all in one place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeTable
              entries={resumeEntries}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewNote={handleViewNote}
              selectedEntryIds={selectedEntryIds}
              onSelectEntry={handleSelectEntry}
              onSelectAllEntries={handleSelectAllEntries}
            />
          </CardContent>
        </Card>
      </main>

      {selectedEntryIds.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="destructive" onClick={handleDeleteSelected} size="lg" className="shadow-lg">
            <Trash2 className="mr-2 h-5 w-5" /> Delete Selected ({selectedEntryIds.length})
          </Button>
        </div>
      )}

      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resume entry for
              "{entryToDelete?.companyName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEntryToDelete(undefined)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!noteToView} onOpenChange={() => setNoteToView(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Note for {noteToView?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {noteToView?.image && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <img src={noteToView.image} alt="Uploaded note" className="object-contain w-full h-full" />
              </div>
            )}
            {noteToView?.note ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{noteToView.note}</p>
            ) : (
              !noteToView?.image && <p className="text-sm text-muted-foreground">No note or image added.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setNoteToView(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResuTrack. Built with professionalism.
      </footer>
    </div>
  );
}
