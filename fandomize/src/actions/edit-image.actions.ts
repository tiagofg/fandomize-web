"use server";

export async function editImageAction(
  file: File,
  imageStyle: string,
  additionalDetails: string,
): Promise<string | { error: string }> {
  console.log("Iniciando edição de imagem...");
  console.log("Arquivo recebido:", file);
  console.log("Estilo da imagem:", imageStyle);
  console.log("Detalhes adicionais:", additionalDetails);

  const serviceUrl = process.env.FANDOMIZE_SERVICE_URL;

  if (!serviceUrl) {
    throw new Error("SERVICE_URL não está definida no ambiente");
  }

  const formData = new FormData();

  formData.append("uploaded_image", file);
  formData.append("image_style", imageStyle);
  formData.append("additional_details", additionalDetails);

  const res = await fetch(`${serviceUrl}/edit-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();

    console.error(`Erro ao editar imagem: ${res.status} – ${text}`);

    return { error: "security" };
  }

  const { image: base64 } = await res.json();

  return base64;
}
