/**
 * Cloudinary Loader Utility
 * 
 * Generates an optimized Cloudinary URL for images.
 * Enforces auto-format (f_auto) and auto-quality (q_auto) to minimize badwidth usage.
 * 
 * Usage:
 * <img src={cloudinaryLoader({ src: 'my-image-public-id', width: 800 })} />
 */

const CLOUDINARY_CLOUD_NAME = 'project-threada'; // Replace with actual cloud name if available, or keep as placeholder for now

interface CloudinaryLoaderProps {
    src: string;
    width?: number;
    quality?: number;
}

export const cloudinaryLoader = ({ src, width, quality }: CloudinaryLoaderProps): string => {
    // If it's already a full URL (e.g. external image), return as is or handle accordingly.
    // For proper Cloudinary usage, 'src' should be the public ID.
    if (src.startsWith('http')) {
        return src;
    }

    const params = [
        'f_auto',
        'q_auto',
        width ? `w_${width}` : undefined,
        quality ? `q_${quality}` : undefined,
    ].filter(Boolean);

    const paramsString = params.join(',');

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${paramsString}/${src}`;
};
