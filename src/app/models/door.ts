import { DoorVariant } from "./door-variant";
import { ProductMedia } from "./product-media";

export interface Door {
    id: number;
    name: string;
    withMirror: boolean;
    imageUrl: string; // Keep for backward compatibility
    videoUrl?: string; // Keep for backward compatibility
    variants: DoorVariant[]; // Array of variants for height, width, and price
    
    // Multiple media support
    images?: ProductMedia[];
    videos?: ProductMedia[];
}