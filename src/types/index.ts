export type Unit = 'px' | 'cm' | 'mm' | 'inch' | 'ft';
export type SizeUnit = 'B' | 'KB' | 'MB';
export type ImageFormat = 'original' | 'JPG' | 'JPEG' | 'PNG' | 'WEBP' | 'HEIC';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface Preset {
  name: string;
  width: number;
  height: number;
  unit: Unit;
}

export interface ImageFile {
  file: File;
  preview: string;
  dimensions?: ImageDimensions;
}