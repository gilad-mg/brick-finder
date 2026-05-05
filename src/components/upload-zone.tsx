"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, RefreshCcw, ScanLine } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { useSoundFx } from "./sound-provider";

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1280;
const COMPRESS_THRESHOLD = 1024 * 1024; // 1MB
const COMPRESS_QUALITY = 0.8;

interface RecognizedItem {
  setNum: string;
  confidence: number;
  name: string;
  themeName: string;
  year: number;
  numParts: number;
  imageUrl: string;
}

interface RecognizeResult {
  items: RecognizedItem[];
  elapsedMs: number;
}

async function compressIfNeeded(file: File): Promise<File> {
  if (file.size <= COMPRESS_THRESHOLD) return file;
  if (typeof document === "undefined") return file;
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new globalThis.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const ratio = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * ratio));
  const h = Math.max(1, Math.round(img.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", COMPRESS_QUALITY),
  );
  if (!blob) return file;
  return new File([blob], "compressed.jpg", { type: "image/jpeg" });
}

export function UploadZone() {
  const t = useTranslations("imageSearch");
  const locale = useLocale();
  const router = useRouter();
  const { play } = useSoundFx();

  const [dragOver, setDragOver] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<RecognizeResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const recognize = React.useCallback(
    async (file: File) => {
      if (file.size > MAX_BYTES) {
        toast.error(t("fileTooLarge"));
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(t("fileWrongType"));
        return;
      }
      setBusy(true);
      setError(null);
      setResult(null);
      try {
        const compressed = await compressIfNeeded(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(compressed));
        const fd = new FormData();
        fd.append("image", compressed);
        const res = await fetch("/api/recognize", { method: "POST", body: fd });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as RecognizeResult;
        setResult(data);
        play("pop");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown";
        setError(message);
        toast.error(t("uploadError"));
      } finally {
        setBusy(false);
      }
    },
    [previewUrl, play, t],
  );

  React.useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            void recognize(file);
            return;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [recognize]);

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void recognize(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void recognize(file);
  };

  return (
    <div className="flex flex-col gap-8">
      {!previewUrl && !result && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed bg-card/60 p-10 sm:p-16 text-center transition-all",
            dragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40",
          )}
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          >
            <ImagePlus className="h-8 w-8" aria-hidden />
          </motion.div>
          <div>
            <p className="text-lg font-semibold text-foreground">{t("drop")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("orClick")}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="h-4 w-4" />
              {t("orClick")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => cameraInputRef.current?.click()}
              className="sm:hidden"
            >
              <Camera className="h-4 w-4" />
              {t("camera")}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t("supportedFormats")}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={onChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={onChange}
          />
        </div>
      )}

      {previewUrl && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card">
            <Image
              src={previewUrl}
              alt=""
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {busy && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur">
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
                >
                  <ScanLine className="h-6 w-6" />
                </motion.div>
                <p className="text-sm font-medium text-foreground">{t("looking")}</p>
              </div>
            )}
            <button
              type="button"
              onClick={reset}
              className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-card"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {t("tryAnother")}
            </button>
          </div>
          <div className="min-h-[12rem]">
            <AnimatePresence mode="wait">
              {result && result.items.length > 0 && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-6"
                >
                  <TopMatch item={result.items[0]} locale={locale} />
                  {result.items.length > 1 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("alsoMaybe")}
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                        {result.items.slice(1).map((item) => (
                          <SmallMatch key={item.setNum} item={item} locale={locale} />
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push("/search")}
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {t("fallbackCta")} →
                  </button>
                </motion.div>
              )}
              {result && result.items.length === 0 && !error && (
                <motion.div
                  key="no-result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center"
                >
                  <p className="text-base font-semibold text-foreground">{t("fallback")}</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="mt-5"
                    onClick={() => router.push("/search")}
                  >
                    {t("fallbackCta")}
                  </Button>
                </motion.div>
              )}
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-3xl border border-accent/40 bg-accent/10 p-6 text-accent"
                >
                  <p className="text-sm font-medium">{t("uploadError")}</p>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="mt-4"
                    onClick={() => router.push("/search")}
                  >
                    {t("fallbackCta")}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">{t("privacyNote")}</p>
    </div>
  );
}

function TopMatch({ item, locale }: { item: RecognizedItem; locale: string }) {
  const t = useTranslations("imageSearch");
  const router = useRouter();
  const score = Math.round(Math.max(0, Math.min(1, item.confidence)) * 100);
  return (
    <button
      type="button"
      onClick={() => router.push(`/sets/${encodeURIComponent(item.setNum)}`)}
      className="group flex w-full items-stretch gap-4 rounded-3xl border border-border bg-card p-4 text-start shadow-sm transition-all hover:border-primary/40 hover:shadow-lg"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt="" fill sizes="96px" className="object-contain p-1" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            {t("topMatch")}
          </span>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">
            {t("confidence", { score })}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {item.name}
        </p>
        <p className="text-xs text-muted-foreground">
          #{item.setNum}
          {item.year ? ` · ${item.year}` : ""}
          {item.numParts ? ` · ${formatNumber(item.numParts, locale)}` : ""}
        </p>
      </div>
    </button>
  );
}

function SmallMatch({ item, locale }: { item: RecognizedItem; locale: string }) {
  const t = useTranslations("imageSearch");
  const router = useRouter();
  const score = Math.round(Math.max(0, Math.min(1, item.confidence)) * 100);
  return (
    <button
      type="button"
      onClick={() => router.push(`/sets/${encodeURIComponent(item.setNum)}`)}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-start transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          #{item.setNum} · {t("confidence", { score })}
          {item.numParts ? ` · ${formatNumber(item.numParts, locale)}` : ""}
        </p>
      </div>
    </button>
  );
}
