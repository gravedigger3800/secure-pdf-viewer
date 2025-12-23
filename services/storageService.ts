import { FileRecord } from '../types';

const STORAGE_KEY = 'secure_view_files';

// Helper to generate a random ID
const generateId = (): string => Math.random().toString(36).substring(2, 15);

// Save a file to local storage (Simulates uploading to cloud/S3)
export const saveFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64Data = reader.result as string;
        const id = generateId();
        const record: FileRecord = {
          id,
          name: file.name,
          data: base64Data,
          createdAt: Date.now(),
        };

        // In a real app, this would be an API call. 
        // For MVP, we use localStorage. Note: LocalStorage has a size limit (usually ~5MB).
        const existingData = localStorage.getItem(STORAGE_KEY);
        const files = existingData ? JSON.parse(existingData) : {};
        
        files[id] = record;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
        
        resolve(id);
      } catch (err) {
        reject(new Error("File too large for local browser storage demo. Please use a smaller PDF (< 5MB)."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Retrieve a file by ID
export const getFile = (id: string): FileRecord | null => {
  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return null;
    const files = JSON.parse(existingData);
    return files[id] || null;
  } catch (e) {
    console.error("Error reading storage", e);
    return null;
  }
};