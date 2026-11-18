const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export function validateScreenshotFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Please upload a PNG, JPG, or WEBP screenshot image.";
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    return "Screenshot file size must be under 5 MB.";
  }
  return null;
}

export function buildScreenshotPath(
  userId: string,
  tag: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "png";
  const timestamp = Date.now();
  return `${userId}/${timestamp}-${tag}.${ext}`;
}
