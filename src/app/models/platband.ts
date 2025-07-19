import { PlatbandVariant } from "./platband-variant";
import { ProductMedia } from "./product-media";

export interface Platband {
    id: number;
    width: number;
    color: string;
    imageUrl: string;
    videoUrl?: string; // Optional video URL
    type: string;
    variants: PlatbandVariant[] // Array of variants for height, width, and price
    media?: ProductMedia[]; // Array of media files (images and videos)
}