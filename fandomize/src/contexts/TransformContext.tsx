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

    const storedStyle = localStorage.getItem("imageStyle");
    const storedDetails = localStorage.getItem("additionalDetails");
    const storedStyleDetails = localStorage.getItem("styleDetails");

    if (storedStyle) setImageStyle(storedStyle);
    if (storedDetails) setAdditionalDetails(storedDetails);
    if (storedStyleDetails) setStyleDetails(storedStyleDetails);

    const dataUrl = localStorage.getItem("uploadedImageData");
    const name = localStorage.getItem("uploadedImageName");
    const type = localStorage.getItem("uploadedImageType") || "";

    if (dataUrl && name) {
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], name, { type });
          setUploadedImageState(file);
        })
        .catch(() => {
          localStorage.removeItem("uploadedImageData");
          localStorage.removeItem("uploadedImageName");
          localStorage.removeItem("uploadedImageType");
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
      localStorage.removeItem("uploadedImageData");
      localStorage.removeItem("uploadedImageName");
      localStorage.removeItem("uploadedImageType");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      localStorage.setItem("uploadedImageData", result);
      localStorage.setItem("uploadedImageName", uploadedImage.name);
      localStorage.setItem("uploadedImageType", uploadedImage.type);
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
    throw new Error("useTransform must be used within a TransformProvider");
  }

  return context;
}
