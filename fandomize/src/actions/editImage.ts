"use server";

export async function editImageAction(
  file: File,
  imageStyle: string,
  additionalDetails: string
): Promise<string> {
  const serviceUrl = process.env.FANDOMIZE_SERVICE_URL;

  if (!serviceUrl) {
    throw new Error("SERVICE_URL não está definida no ambiente");
  }

  const formData = new FormData();

  formData.append("uploaded_image", file);
  formData.append("image_style", imageStyle);
  formData.append("additional_details", additionalDetails);

  const res = await fetch(`${serviceUrl}/edit-image/`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`Erro ao editar imagem: ${res.status} – ${text}`);
  }

  const { image: base64 } = await res.json();

  return base64;
}
