"use client";

import {
  ChevronUpDownIcon
} from '@heroicons/react/24/solid';

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
