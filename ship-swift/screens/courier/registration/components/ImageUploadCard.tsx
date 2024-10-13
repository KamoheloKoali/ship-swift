import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploadCardProps {
  folder: string;
  cardTitle: string;
  onFileChange: (file: File | null) => void;
  existingImageUrl?: string | null;
}

const imageSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "image/png" || file.type === "image/jpeg", {
    message: "Only PNG & JPG files are allowed.",
  }),
});

export default function ImageUploadCard({
  folder,
  cardTitle,
  onFileChange,
  existingImageUrl = null,
}: ImageUploadCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = imageSchema.safeParse({ file });
      if (validation.success) {
        onFileChange(file);
        const objectUrl = URL.createObjectURL(file);
        setImageUrl(objectUrl);
      } else {
        alert(validation.error.errors[0]?.message);
        onFileChange(null);
      }
    }
  };

  return (
    <Card className="w-full bg-white shadow-md overflow-hidden transition-all duration-200 ease-in-out transform hover:shadow-lg hover:scale-105 rounded-none">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Document Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md h-48 flex flex-col items-center justify-center bg-gray-50">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">No Image Selected</span>
            </div>
          )}
          <label
            htmlFor={`file-upload-${folder}`}
            className="absolute bottom-2 right-2 bg-black text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-800 transition-colors duration-200"
          >
            <Upload className="w-4 h-4 inline-block mr-2" />
            {imageUrl ? "Replace Image" : "Upload Image"}
          </label>
          <input
            id={`file-upload-${folder}`}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
