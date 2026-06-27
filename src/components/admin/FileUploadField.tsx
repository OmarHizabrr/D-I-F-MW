"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadFile } from "@/lib/firebase/storage";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface FileUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  hint?: string;
}

export function FileUploadField({
  label,
  value = "",
  onChange,
  folder,
  accept = "image/*",
  hint,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelect(file: File) {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file, folder);
      onChange(url);
    } catch {
      setError("فشل رفع الملف. حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFileSelect(file);
    e.target.value = "";
  }

  const isImage = value && /\.(jpg|jpeg|png|gif|webp|svg)/i.test(value);

  return (
    <div className="flex w-full flex-col gap-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-border-subtle/30">
          {isImage ? (
            <div className="relative aspect-video w-full">
              <Image src={value} alt="" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <p className="truncate px-4 py-3 text-sm text-muted-foreground">{value}</p>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute end-2 top-2 h-8 w-8"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border",
            "bg-input-bg text-muted-foreground transition-colors hover:border-brand-green hover:bg-brand-green/5 hover:text-brand-green",
            uploading && "cursor-wait opacity-60"
          )}
        >
          <Upload className="h-6 w-6" />
          <span className="text-sm font-medium">
            {uploading ? "جاري الرفع..." : "اضغط لرفع ملف"}
          </span>
        </button>
      )}

      {value && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          استبدال الملف
        </Button>
      )}

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
