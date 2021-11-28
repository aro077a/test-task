export interface IImages {
  images: TImages[];
  loading: boolean;
  error?: string | unknown;
  currentPage: number;
  filteredImages: TImages[];
  isFilterByAlbum: boolean;
}

export type TImages = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type TImageID = number;
