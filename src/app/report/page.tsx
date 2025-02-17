"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import Header from "../header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reportSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().max(100, "Description must be 100 characters or less"),
    address: z.string().min(1, "Address is required"),
    wheelchairAccessible: z.boolean().optional(),
    deafFriendly: z.boolean().optional(),
    brailleAvailable: z.boolean().optional(),
    image: z.any().optional()
});

export default function Report() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(reportSchema),
    });

    const [preview, setPreview] = useState<string | null>(null);

    const onSubmit = (data: any) => {
        console.log("Form Data:", data);
        alert("Report Submitted!");
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setValue("image", file);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header />

            <div className="flex-grow flex items-center justify-center text-black">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">Report Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block font-semibold">Title:</label>
                                <Input type="text" {...register("title")} className="w-full" />
                                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-semibold">Description:</label>
                                <Textarea {...register("description")} maxLength={100} className="w-full" />
                                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-semibold">Address:</label>
                                <Input type="text" {...register("address")} className="w-full" />
                                {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                            </div>

                            {/* Checkboxes */}
                            <div>
                                <label className="block font-semibold">Accessibility Options:</label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox {...register("wheelchairAccessible")} />
                                        <span>Wheelchair Accessible</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox {...register("deafFriendly")} />
                                        <span>Deaf Friendly</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox {...register("brailleAvailable")} />
                                        <span>Braille Available</span>
                                    </div>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block font-semibold">Upload Image:</label>
                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                                Submit
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
