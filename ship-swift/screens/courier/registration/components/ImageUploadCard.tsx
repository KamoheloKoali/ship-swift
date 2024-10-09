// components/ImageUploadCard.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { uploadImage } from '@/screens/courier/registration/utils/Upload'; // Import the utility function

interface ImageUploadCardProps {
  folder: string; // New prop to specify the upload folder
  cardTitle: string;
}

export default function ImageUploadCard({ folder, cardTitle }: ImageUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      const objectUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(objectUrl); // Preview the image locally
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setLoading(true);

    const { url, error } = await uploadImage(file, folder);  // Pass the folder to the utility function

    if (error) {
      alert(`Error uploading file: ${error}`);
    } else if (url) {
      setImageUrl(url); // Display the public URL of the uploaded image
      console.log('Uploaded image URL:', url); // Log the URL to the console
      alert('Image uploaded successfully!');
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md p-4">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle> {/* Display the folder name */}
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <img src={imageUrl} alt="Profile Preview" className="w-full h-64 object-cover rounded-md" />
        ) : (
          <div className="border border-dashed border-gray-400 rounded-md h-64 flex items-center justify-center">
            <span className="text-gray-500">No Image Selected</span>
          </div>
        )}

        <input
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleUpload} disabled={loading} className="w-full">
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </CardFooter>
    </Card>
  );
}
