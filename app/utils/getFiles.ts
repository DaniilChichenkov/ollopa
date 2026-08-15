export function getFiles(
  formData: FormData,
  field: string,
  options?: {
    maxSize?: number;
    allowedTypes?: string[];
  },
): File[] {
  const files = formData
    .getAll(field)
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (files.length === 0) {
    throw new Error("Please select at least one file.");
  }

  for (const file of files) {
    if (options?.maxSize && file.size > options.maxSize) {
      throw new Error(`${file.name} exceeds the maximum file size.`);
    }

    if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
      throw new Error(`${file.name} has an unsupported file type.`);
    }
  }

  return files;
}
