export interface ProductMedia {
    id: number;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    productType: string; // "door", "frame", "extension", "platband"
    productId: number;
    displayOrder: number;
    description?: string;
}

export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
} 