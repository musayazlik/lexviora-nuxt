export interface MediaAsset {
  id?: number;
  assetId?: number;
  name: string;
  url: string;
  mime?: string;
  size: number;
  alt?: string;
  bundled?: boolean;
}
