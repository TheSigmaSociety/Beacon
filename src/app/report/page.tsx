"use client"

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // Ensure you have a toast component
import { createBeacon } from "@/lib/api"; // Import the API function
import Header from "../header";
import imageCompression from "browser-image-compression";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [wheelchair, setWheelchair] = useState(false);
  const [audio, setAudio] = useState(false);
  const [vision, setVision] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { toast } = useToast();

  // ✅ Convert Image to Base64
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // Image compression options
    const options = {
      maxSizeMB: 0.5, // Limit image size to 500KB
      maxWidthOrHeight: 1024, // Resize image to 1024px max
      useWebWorker: true,
    };
  
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
  
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setImagePreview(base64String);
      };
    } catch (error) {
      console.error("❌ Image compression error:", error);
      alert("Image compression failed. Please try again.");
    }
  };

  // ✅ Fetch User's Location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        alert("Unable to retrieve location. Please allow location access.");
        console.error("❌ Geolocation error:", error);
      }
    );
  };

  // Auto-fetch location on component mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // ✅ Handle Form Submission
  const onSubmit = async () => {
    if (!title || !description || latitude === null || longitude === null) {
      alert("Please fill out all required fields.");
      return;
    }

    const formattedData = {
        title,
        description,
        location: { lat: latitude, lng: longitude },
        lat: latitude,
        lng: longitude,
        image: image || null,
        accessibility: {
          wheelchair,
          audio,
          vision,
        },
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

      // Reset form
      setTitle("");
      setDescription("");
      setWheelchair(false);
      setAudio(false);
      setVision(false);
      setImage(null);
      setImagePreview(null);
      fetchLocation(); // Refresh location
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit report");
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex justify-center items-center p-4">
        <Card className="w-full max-w-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center">Submit a Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
              </div>

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" type="number" value={latitude ?? ""} readOnly />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" type="number" value={longitude ?? ""} readOnly />
                </div>
              </div>

              {/* Fetch Location Button */}
              <Button type="button" onClick={fetchLocation} className="w-full bg-blue-500 hover:bg-blue-700">
                Get Current Location
              </Button>

              {/* Accessibility Options */}
              <div>
                <Label className="font-semibold">Accessibility Options</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wheelchair" checked={wheelchair} onCheckedChange={setWheelchair} />
                    <Label htmlFor="wheelchair">Wheelchair Accessible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="audio" checked={audio} onCheckedChange={setAudio} />
                    <Label htmlFor="audio">Audio Accessible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="vision" checked={vision} onCheckedChange={setVision} />
                    <Label htmlFor="vision">Vision Accessible</Label>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="image">Upload Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-full h-auto rounded-md" />}
              </div>

              {/* Submit Button */}
              <Button type="button" onClick={onSubmit} className="w-full bg-black hover:bg-gray-800" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>

              {/* Error Message */}
              {submitError && <p className="text-red-500 text-sm text-center">{submitError}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
