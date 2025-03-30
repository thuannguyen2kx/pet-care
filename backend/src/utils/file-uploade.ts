import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from '../config/app.config';

// Configure cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

// Folder paths for different upload types
const folderPaths = {
  profilePictures: 'pet-care/users/profile',
  petPictures: 'pet-care/pets',
  serviceImages: 'pet-care/services',
  reviewImages: 'pet-care/reviews',
  postMedia: 'pet-care/posts',
  documents: 'pet-care/documents',
};

// Define correct params interface for CloudinaryStorage
interface CloudinaryStorageParams {
  cloudinary: typeof cloudinary;
  params: {
    folder: string;
    allowed_formats?: string[];
    transformation?: Array<Record<string, any>>;
    resource_type?: string;
    format?: string;
    public_id?: (req: any, file: Express.Multer.File) => string;
  };
}

// Create storage engine for profile pictures
const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.profilePictures,
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
} as CloudinaryStorageParams);

// Create storage engine for pet pictures
const petPictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.petPictures,
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
} as CloudinaryStorageParams);

// Create storage engine for service images
const serviceImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.serviceImages,
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
} as CloudinaryStorageParams);

// Create storage engine for review images
const reviewImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.reviewImages,
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
} as CloudinaryStorageParams);

// Create storage engine for post media
const postMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.postMedia,
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
    resource_type: 'auto',
  },
} as CloudinaryStorageParams);

// Create storage engine for documents
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderPaths.documents,
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
  },
} as CloudinaryStorageParams);

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Create upload middleware
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadPetPicture = multer({
  storage: petPictureStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadServiceImage = multer({
  storage: serviceImageStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadReviewImage = multer({
  storage: reviewImageStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadPostMedia = multer({
  storage: postMediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for videos
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Delete file from cloudinary
export const deleteFile = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file');
  }
};