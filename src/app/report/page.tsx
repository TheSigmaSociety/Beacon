"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormControl, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import Header from "../header";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(100, "Description cannot exceed 100 characters").optional(),
  address: z.string().min(1, "Address is required"),
  wheelchairAccessible: z.boolean().optional(),
  deafFriendly: z.boolean().optional(),
  brailleAvailable: z.boolean().optional(),
  image: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "Image is required")
    .optional(),
});

export default function ReportsPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      wheelchairAccessible: false,
      deafFriendly: false,
      brailleAvailable: false,
      image: undefined,
    },
  });

  const { handleSubmit, setValue, watch, formState: { errors } } = form;
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert("Report submitted successfully!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", e.target.files);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]"> {/* ✅ Set background color */}
      <Header /> {/* ✅ Add Header at the top */}

      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h1 className="text-2xl font-bold mb-4">Submit a Report</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage>{errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the report (max 100 characters)" {...field} />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage>{errors.address?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Accessibility Options */}
            <div className="space-y-2">
              <Label className="font-semibold">Accessibility Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="wheelchairAccessible" {...form.register("wheelchairAccessible")} />
                <Label htmlFor="wheelchairAccessible">Wheelchair Accessible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="deafFriendly" {...form.register("deafFriendly")} />
                <Label htmlFor="deafFriendly">Deaf Friendly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="brailleAvailable" {...form.register("brailleAvailable")} />
                <Label htmlFor="brailleAvailable">Braille Available</Label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />
                  </FormControl>
                  {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
                  <FormMessage>{errors.image?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Submit Report</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
