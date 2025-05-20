"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, IndianRupee, Briefcase, Link as LinkIcon, Paperclip, Image as ImageIcon, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

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
    console.log("File selected:", file); // Debugging log

    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      console.log("File type:", file.type); // Debugging log
      console.log("File size:", file.size); // Debugging log

      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: `Please upload a valid image. Received type: ${file.type}`
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: `Image must be smaller than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadstart = () => {
        console.log("File reading started"); // Debugging log
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error); // Error logging
        toast({
          variant: "destructive",
          title: "Image Upload Error",
          description: "Failed to read the image file"
        });
      };
      reader.onloadend = () => {
        console.log("File reading completed"); // Debugging log
        const dataUri = reader.result as string;
        console.log("Data URI length:", dataUri.length); // Debugging log
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
      fileInputRef.current.value = ""; // Clear the file input
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
          {renderOptionalDateTimePicker("examDate", "Exam Date")}
          {renderOptionalDateTimePicker("interviewDate", "Interview Date")}
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image (Optional)</FormLabel>
              <FormControl>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      id="image-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                    >
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Choose Image
                    </label>

                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                      >
                        <X className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    )}
                  </div>

                  {imagePreview && (
                    <div className="mt-4 max-w-xs">
                      <div className="relative border-2 border-dashed rounded-lg p-2">
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          className="max-w-full max-h-[300px] object-contain rounded-md mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about the resume submission"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : (isEditing ? "Update Entry" : "Add Entry")}
        </Button>
      </form>
    </Form>
  );
}
