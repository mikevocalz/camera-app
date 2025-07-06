import path from 'path';

export const videoExtensions = ['.m4v', '.mp4', '.mov'];

export type MediaType = 'image' | 'video' | 'unknown';

export const getMediaType = (filename: string): MediaType => {
  const lowercased = filename.toLowerCase();
  
  if (lowercased.endsWith('.jpg') || 
      lowercased.endsWith('.jpeg') || 
      lowercased.endsWith('.png') || 
      lowercased.endsWith('.webp') ||
      lowercased.endsWith('.gif')) {
    return 'image';
  }
  
  if (lowercased.endsWith('.mp4') || 
      lowercased.endsWith('.mov')) {
    return 'video';
  }
  
  return 'unknown';
};
