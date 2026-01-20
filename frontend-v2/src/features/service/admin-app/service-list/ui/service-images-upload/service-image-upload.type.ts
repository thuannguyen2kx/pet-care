export type ExistingImage = {
  id: string;
  url: string;
};

export type NewImage = {
  file: File;
  previewUrl: string;
};

export type ImageFieldValue = {
  existing: ExistingImage[];
  added: NewImage[];
};
