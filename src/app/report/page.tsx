"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createBeacon } from "../../lib/api";
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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(100, "Description cannot exceed 100 characters"),
  location: z.string().min(1, "Location is required"),
  lat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
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

  // Fetch user's location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("lat", position.coords.latitude);
          setValue("lng", position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not fetch your location. Please enter manually.",
            duration: 3000,
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Unsupported",
        description: "Your browser does not support geolocation.",
        duration: 3000,
      });
    }
  }, [setValue, toast]);

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
      },
    };

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
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        duration: 3000,
      });
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
      <div className="flex flex-grow items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                          placeholder="Fetching location..."
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
                          placeholder="Fetching location..."
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

              <Button type="submit" className="w-full bg-gray-700 text-white">
                Submit Report
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
