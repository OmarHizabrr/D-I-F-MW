"use client";

import { Input } from "@/components/ui/Input";
import { youTubeEmbedUrl } from "@/lib/firebase/storage";

export interface YouTubeFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function YouTubeField({ label = "رابط يوتيوب", value = "", onChange, hint }: YouTubeFieldProps) {
  const embedUrl = youTubeEmbedUrl(value);

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        label={label}
        type="url"
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        hint={hint ?? "الصق رابط فيديو يوتيوب كاملاً"}
      />

      {embedUrl && (
        <div className="overflow-hidden rounded-2xl border border-border bg-black/5">
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              title="معاينة يوتيوب"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
