import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxWidth?: number;    
  quality?: number;    
  maxSizeMB?: number;   // limite em MB (padrão 
}

export async function compressImageFile(
  file: File,
  { maxWidth = 1024, quality = 0.7, maxSizeMB = 4 }: CompressOptions = {}
): Promise<File> {
  const imgBitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / imgBitmap.width);
  const w = Math.round(imgBitmap.width  * scale);
  const h = Math.round(imgBitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width  = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D não disponível');
  ctx.drawImage(imgBitmap, 0, 0, w, h);

  const blobFromCanvas = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, file.type, quality)
  );
  if (!blobFromCanvas) throw new Error('Falha ao gerar blob do canvas');

  const fileFromCanvas = new File([blobFromCanvas], file.name, { type: file.type });

  const compressedBlob = await imageCompression(fileFromCanvas, {
    maxSizeMB,
    useWebWorker: true,
    fileType: file.type,
    alwaysKeepResolution: true
  });

  return new File([compressedBlob], file.name, { type: file.type });
}
