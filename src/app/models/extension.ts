import { ExtensionVariant } from "./extension-variant";
import { ProductMedia } from "./product-media";

export interface Extension {
    id: number;
    type: string;
    imageUrl: string;
    videoUrl?: string; // Optional video URL
    variants: ExtensionVariant[]
    media?: ProductMedia[]; // Array of media files (images and videos)
}