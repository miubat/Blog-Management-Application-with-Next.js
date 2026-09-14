export const MAX_PHOTO_MB = 2;
export const MAX_PHOTO_BYTES = MAX_PHOTO_MB * 1024 * 1024;

export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ACCEPT_ATTR = ALLOWED_TYPES.join(",");

export function validatePhoto(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Photo must be a JPG, PNG, GIF or WEBP image";
  }

  if (file.size > MAX_PHOTO_BYTES) {
    const actualMb = (file.size / 1024 / 1024).toFixed(1);
    return `Photo must be ${MAX_PHOTO_MB} MB or smaller (this one is ${actualMb} MB)`;
  }

  return null;
}
