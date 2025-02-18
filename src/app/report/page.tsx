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
import { getAllBeacons, createBeacon } from "../../lib/api";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Header from "../header";
import { useToast } from "@/components/ui/use-toast";
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(100, "Description cannot exceed 100 characters"),
  location: z.string().min(1, "Location is required"),
  lat: z
    .string()
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -90 &&
        parseFloat(val) <= 90,
      {
        message: "Latitude must be a number between -90 and 90",
      }
    )
    .transform((val) => parseFloat(val)),
  lng: z
    .string()
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -180 &&
        parseFloat(val) <= 180,
      {
        message: "Longitude must be a number between -180 and 180",
      }
    )
    .transform((val) => parseFloat(val)),
  wheelchair: z.boolean().default(false),
  audio: z.boolean().default(false),
  vision: z.boolean().default(false),
  image: z.string().optional(),
});

export default function ReportsPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      lat: 0,
      lng: 0,
      wheelchair: false,
      audio: false,
      vision: false,
      image: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    const formattedData = {
      entry: {
        title: data.title,
        description: data.description,
        location: data.location,
        lat: data.lat,
        lng: data.lng,
        image: data.image || null,
        accessibility: {
          wheelchair: data.wheelchair,
          audio: data.audio,
          vision: data.vision,
        },
        // votes: 0 // note needed as server takes care of that :D
      }
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createBeacon(formattedData);
      toast({
        title: "Success",
        description: "Report submitted successfully!",
        duration: 3000,
      });
      form.reset();
      setPreview(null);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit report');
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("image", base64String.split(",")[1]); // Remove data:image/... prefix
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] flex flex-col bg-hero-polka-dots-100">
      <Header />
      <div className="absolute top-10 left-[-3rem] w-1/2 h-1/3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 opacity-40 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 opacity-30 blur-3xl rounded-full"></div>
      <div className="flex flex-grow items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-hidden z-20">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Submit a Report
          </h1>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the report (max 100 characters)"
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage>{errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter latitude"
                          type="number"
                          step="any"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{errors.lat?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lng"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter longitude"
                          type="number"
                          step="any"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{errors.lng?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Accessibility Options */}
              <div className="space-y-2">
                <Label className="font-semibold">Accessibility Options</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Checkbox id="wheelchair" {...form.register("wheelchair")} />
                  <Label htmlFor="wheelchair">Wheelchair Accessible</Label>

                  <Checkbox id="audio" {...form.register("audio")} />
                  <Label htmlFor="audio">Audio Assistance</Label>

                  <Checkbox id="vision" {...form.register("vision")} />
                  <Label htmlFor="vision">Vision Assistance</Label>
                </div>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    )}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-800 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
              {submitError && (
                <div className="text-red-500 mt-4">{submitError}</div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
