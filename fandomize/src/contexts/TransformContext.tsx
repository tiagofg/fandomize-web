import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface TransformContextType {
  uploadedImage: File | null;
  setUploadedImage: (image: File | null) => void;
  imageStyle: string;
  setImageStyle: (style: string) => void;
  additionalDetails: string;
  setAdditionalDetails: (details: string) => void;
  styleDetails: string;
  setStyleDetails: (details: string) => void;
}

const TransformContext = createContext<TransformContextType | undefined>(
  undefined
);

interface TransformProviderProps {
  children: ReactNode;
}

export default function TransformProvider({ children }: TransformProviderProps) {
  const [uploadedImage, setUploadedImageState] = useState<File | null>(null);
  const [imageStyle, setImageStyle] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [styleDetails, setStyleDetails] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mappings = [
      ["imageStyle", setImageStyle],
      ["additionalDetails", setAdditionalDetails],
      ["styleDetails", setStyleDetails],
    ] as const;

    mappings.forEach(([key, setter]) => {
      const value = localStorage.getItem(key);
      if (value) setter(value);
    });

    const dataUrl = localStorage.getItem("uploadedImageData");
    const name = localStorage.getItem("uploadedImageName");
    const type = localStorage.getItem("uploadedImageType") || "";

    if (dataUrl && name) {
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => new File([blob], name, { type }))
        .then(setUploadedImageState)
        .catch(() => {
          [
            "uploadedImageData",
            "uploadedImageName",
            "uploadedImageType",
          ].forEach((k) => localStorage.removeItem(k));
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("imageStyle", imageStyle);
  }, [imageStyle]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("additionalDetails", additionalDetails);
  }, [additionalDetails]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("styleDetails", styleDetails);
  }, [styleDetails]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!uploadedImage) {
      [
        "uploadedImageData",
        "uploadedImageName",
        "uploadedImageType",
      ].forEach((k) => localStorage.removeItem(k));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      try {
        localStorage.setItem("uploadedImageData", base64);
        localStorage.setItem("uploadedImageName", uploadedImage.name);
        localStorage.setItem("uploadedImageType", uploadedImage.type);
      } catch (error) {
        console.error("Erro ao gravar imagem no localStorage:", error);
      }
    };
    reader.readAsDataURL(uploadedImage);
  }, [uploadedImage]);

  const setUploadedImage = (file: File | null) => {
    setUploadedImageState(file);
  };

  return (
    <TransformContext.Provider
      value={{
        uploadedImage,
        setUploadedImage,
        imageStyle,
        setImageStyle,
        additionalDetails,
        setAdditionalDetails,
        styleDetails,
        setStyleDetails,
      }}
    >
      {children}
    </TransformContext.Provider>
  );
}

export function useTransform() {
  const context = useContext(TransformContext);
  if (context === undefined) {
    throw new Error(
      "useTransform must be used within a TransformProvider"
    );
  }
  return context;
}
