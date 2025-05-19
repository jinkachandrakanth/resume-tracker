
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, IndianRupee, Briefcase, Link as LinkIcon, Paperclip, Image as ImageIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { resumeEntrySchema, type ResumeFormData, type ResumeEntry } from "@/types";

interface ResumeFormProps {
  onSubmit: (data: ResumeFormData) => void;
  initialData?: ResumeEntry;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function ResumeForm({ onSubmit, initialData, isEditing = false, isLoading = false }: ResumeFormProps) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData?.image || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeEntrySchema),
    defaultValues: initialData || {
      companyName: "",
      resumeLink: "",
      registrationDate: new Date(),
      stipend: 0,
      note: "",
      image: "",
      examDate: null,
      interviewDate: null,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        registrationDate: initialData.registrationDate ? new Date(initialData.registrationDate) : new Date(),
        examDate: initialData.examDate ? new Date(initialData.examDate) : null,
        interviewDate: initialData.interviewDate ? new Date(initialData.interviewDate) : null,
      });
      setImagePreview(initialData.image || null);
    } else {
      form.reset({
        companyName: "",
        resumeLink: "",
        registrationDate: new Date(),
        stipend: 0,
        note: "",
        image: "",
        examDate: null,
        interviewDate: null,
      });
      setImagePreview(null);
    }
  }, [initialData, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue("image", dataUri);
        setImagePreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("image", "");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderOptionalDateTimePicker = (name: "examDate" | "interviewDate", label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedDateTime = field.value ? new Date(field.value) : null;

        const handleDateChange = (date: Date | undefined) => {
          if (date) {
            const newDateTime = selectedDateTime ? new Date(selectedDateTime) : new Date();
            newDateTime.setFullYear(date.getFullYear());
            newDateTime.setMonth(date.getMonth());
            newDateTime.setDate(date.getDate());
            if (!selectedDateTime) { // If it's the first time setting date, default time to 00:00
              newDateTime.setHours(0, 0, 0, 0);
            }
            field.onChange(newDateTime);
          } else {
            field.onChange(null); // Clear the date and time
          }
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const timeValue = e.target.value; // "HH:mm"
          if (selectedDateTime && timeValue) {
            const [hours, minutes] = timeValue.split(':').map(Number);
            const newDateTime = new Date(selectedDateTime);
            newDateTime.setHours(hours, minutes, 0, 0); // Set seconds and ms to 0
            field.onChange(newDateTime);
          }
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full sm:flex-1 justify-start text-left font-normal",
                        !selectedDateTime && "text-muted-foreground"
                      )}
                    >
                      {selectedDateTime ? (
                        format(selectedDateTime, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateTime || undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                className="w-full sm:w-auto sm:max-w-[150px]"
                value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
                onChange={handleTimeChange}
                disabled={!selectedDateTime}
              />
            </div>
            {selectedDateTime && (
              <p className="text-xs text-muted-foreground mt-1">
                Selected: {format(selectedDateTime, "PPp")}
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="e.g. Google" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resumeLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume Link</FormLabel>
               <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <FormControl>
                  <Input type="url" placeholder="https://example.com/resume.pdf" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Applied</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date || new Date())}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stipend"
            render={({ field }) => {
              const [isFocused, setIsFocused] = React.useState(false);
              // If focused and RHF value is 0, display empty string in input.
              // Otherwise, display RHF value (which will be '0' if value is 0 and not focused).
              const displayValue = isFocused && field.value === 0 ? '' : field.value;

              return (
                <FormItem>
                  <FormLabel>Stipend (INR)</FormLabel>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 50000"
                        ref={field.ref}
                        name={field.name}
                        value={displayValue}
                        onFocus={() => {
                          setIsFocused(true);
                          // field.onFocus(); // Call RHF's onFocus if it was being passed by {...field}
                        }}
                        onBlur={(e) => {
                          setIsFocused(false);
                          field.onBlur(); // Call RHF's onBlur for touched state, validation etc.
                        }}
                        onChange={e => {
                          // This logic ensures an empty input string becomes 0 in form state
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                        className="pl-10"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {renderOptionalDateTimePicker("examDate", "Exam Date & Time")}
          {renderOptionalDateTimePicker("interviewDate", "Interview Date & Time")}
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any relevant notes here..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Attach Image (Optional)</FormLabel>
          <div className="flex items-center gap-4">
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
                ref={fileInputRef}
              />
            </FormControl>
            <Button type="button" variant="outline" onClick={() => document.getElementById('imageUpload')?.click()}>
              <Paperclip className="mr-2 h-4 w-4" /> {imagePreview ? "Change Image" : "Upload Image"}
            </Button>
          </div>
          {imagePreview && (
            <div className="mt-4 relative w-48 h-32 border rounded-md overflow-hidden group">
               <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <FormMessage>{form.formState.errors.image?.message}</FormMessage>
        </FormItem>
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Saving..." : (isEditing ? "Save Changes" : "Add Entry")}
        </Button>
      </form>
    </Form>
  );
}
