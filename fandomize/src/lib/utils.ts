import imageCompression from "browser-image-compression";

export interface CompressOptions {
  maxWidth?: number;
  quality?: number;
  maxSizeMB?: number; // limite em MB (padrão 4)
}

// Tipos permitidos para saída
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const extensionMap: { [key: string]: string } = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function compressImageFile(
  file: File,
  { maxWidth = 1024, quality = 0.7, maxSizeMB = 3 }: CompressOptions = {},
): Promise<File> {
  let outputType = file.type;
  if (!allowedTypes.includes(outputType)) {
    outputType = "image/jpeg";
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const extension = extensionMap[outputType];
  const newFileName = `${baseName}${extension}`;

  const imgBitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / imgBitmap.width);
  const w = Math.round(imgBitmap.width * scale);
  const h = Math.round(imgBitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D não disponível");
  ctx.drawImage(imgBitmap, 0, 0, w, h);

  const blobFromCanvas = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, quality),
  );
  if (!blobFromCanvas) throw new Error("Falha ao gerar blob do canvas");

  const fileFromCanvas = new File([blobFromCanvas], newFileName, {
    type: outputType,
  });

  const compressedBlob = await imageCompression(fileFromCanvas, {
    maxSizeMB,
    useWebWorker: true,
    fileType: outputType,
    alwaysKeepResolution: true,
  });

  return new File([compressedBlob], newFileName, { type: outputType });
}
