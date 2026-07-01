import { createClient } from "@supabase/supabase-js";
import { BUCKET_NAME } from "../constants/string";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_KEY;

// Create the unified client
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

const { data, error } = await supabase.storage.createBucket(
  "collab-board-files",
  {
    public: true,
    fileSizeLimit: 5242880, // 5MB limit in bytes
  },
);

export const uploadFile = async (file: File) => {
  const filePath = `uploads/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("collab-board-files")
    .upload(filePath, file, {
      cacheControl: "86400",
      upsert: false,
    });
  if (error) throw error;
  return data.path;
};

export const getSupabasePath = (path: string) => {
  const { data } = supabase.storage
    .from("collab-board-files")
    .getPublicUrl(path);
  return data.publicUrl;
};

export const downloadFile = async (filePath: string, fileName: string) => {
  const updatedPath = filePath.split(BUCKET_NAME)[1];
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(updatedPath);
    if (error) throw error;
    const blobUrl = URL.createObjectURL(data);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  } catch (err) {
    console.log("error downloading file", err);
  }
};
