import imageCompression from 'browser-image-compression';

export async function compressImageFile(
  file: File,
  maxSizeMB = 4,
): Promise<File> {
  const options = {
    maxSizeMB,
    useWebWorker: true,
    fileType: file.type,
    alwaysKeepResolution: true,
  };

  const compressedBlob = await imageCompression(file, options);

  const compressedFile = new File([compressedBlob], file.name, {
    type: file.type,
  });

  return compressedFile;
}
