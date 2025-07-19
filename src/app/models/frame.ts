import { PlatbandVariant } from "./platband-variant";
import { ProductMedia } from "./product-media";

export interface Frame {
    id: number;
    width: number;
    thickness: number;
    type: string;
    color: string;
    imageUrl: string;
    videoUrl?: string; // Optional video URL
    variants: PlatbandVariant[] // Array of variants for height, width, and price
    media?: ProductMedia[]; // Array of media files (images and videos)
}