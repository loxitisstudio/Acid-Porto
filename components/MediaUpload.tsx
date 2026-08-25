"use client";

import { useRef } from "react";

type MediaUploadProps = {
  label: string;
  hint?: string;
  currentMedia?: string;
  accept: string;
  buttonLabel: string;
  onUpload: (files: FileList | null) => void;
};

export default function MediaUpload({
  label,
  hint,
  currentMedia,
  accept,
  buttonLabel,
  onUpload,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-xl border border-slate-800 bg-[#07131d] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-100">{label}</div>
          {hint ? <div className="text-xs text-slate-400">{hint}</div> : null}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-md border border-slate-700 px-2 py-1 text-sm text-slate-200"
        >
          {buttonLabel}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          onUpload(event.target.files);
          event.target.value = "";
        }}
      />

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {currentMedia ? (
          <img src={currentMedia} alt={label} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-slate-500">No media yet</div>
        )}
      </div>
    </div>
  );
}
