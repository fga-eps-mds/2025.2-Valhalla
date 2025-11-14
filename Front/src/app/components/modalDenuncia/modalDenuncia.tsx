"use client";

interface DenunciaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function modalDenuncia ({isOpen}:DenunciaModalProps) {
    if (!isOpen) return null;
        return (
            <>
            
            </>
        )
    
}
