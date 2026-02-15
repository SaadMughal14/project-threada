import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageZoomContextType {
    zoomedImageSrc: string | null;
    openZoom: (src: string) => void;
    closeZoom: () => void;
}

const ImageZoomContext = createContext<ImageZoomContextType | undefined>(undefined);

export const ImageZoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [zoomedImageSrc, setZoomedImageSrc] = useState<string | null>(null);

    const openZoom = (src: string) => {
        setZoomedImageSrc(src);
    };

    const closeZoom = () => {
        setZoomedImageSrc(null);
    };

    return (
        <ImageZoomContext.Provider value={{ zoomedImageSrc, openZoom, closeZoom }}>
            {children}
        </ImageZoomContext.Provider>
    );
};

export const useImageZoom = () => {
    const context = useContext(ImageZoomContext);
    if (context === undefined) {
        throw new Error('useImageZoom must be used within an ImageZoomProvider');
    }
    return context;
};
