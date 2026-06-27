import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getFirebaseApp } from "./client";

function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

export async function uploadFile(
  file: File,
  folder: string
): Promise<string> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${folder}/${Date.now()}_${safeName}`;
  const storageRef = ref(getFirebaseStorage(), path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteFileByUrl(fileUrl: string): Promise<void> {
  if (!fileUrl.includes("firebasestorage.googleapis.com")) return;
  const storageRef = ref(getFirebaseStorage(), fileUrl);
  await deleteObject(storageRef);
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export function youTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
