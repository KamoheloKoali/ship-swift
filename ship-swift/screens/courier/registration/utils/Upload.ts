// utils/Upload.ts
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to upload an image to Supabase
export async function uploadImage(file: File, folder: string): Promise<{ url: string | null, error: string | null }> {
  const fileName = `${uuidv4()}.png`; // Generate a unique file name

  try {
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('driver-documents')
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false, // Prevent overwriting if the file already exists
      });

    if (error) {
      return { url: null, error: error.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabase
      .storage
      .from('driver-documents')
      .getPublicUrl(`${folder}/${fileName}`);

    if (publicData) {
      return { url: publicData.publicUrl, error: null };
    }

    return { url: null, error: 'Could not generate public URL' };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
