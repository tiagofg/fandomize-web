// TransformContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface TransformContextType {
  uploadedImage: File | null;
  setUploadedImage: (image: File | null) => void;
  imageStyle: string;
  setImageStyle: (style: string) => void;
  additionalDetails: string;
  setAdditionalDetails: (details: string) => void;
}

const TransformContext = createContext<TransformContextType | undefined>(undefined);

interface TransformProviderProps {
  children: ReactNode;
}

export default function TransformProvider({ children }: TransformProviderProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageStyle, setImageStyle] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");

  return (
    <TransformContext.Provider
      value={{
        uploadedImage,
        setUploadedImage,
        imageStyle,
        setImageStyle,
        additionalDetails,
        setAdditionalDetails,
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
