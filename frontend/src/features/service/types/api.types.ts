export type ServiceType = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: string;
  applicablePetTypes?: string[];
  applicablePetSizes?: string[];
  images?: {url: string, publicId: string}[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type GetServicesResponseType = {
  message: string,
  services: ServiceType[]
}
export type GetServiceResonseType = {
  message: string,
  service: ServiceType
}
export type CreateServiceResponseType = {
  message: string,
  service: ServiceType
}
export type UpdateServiceResponeType = {
  message: string,
  service: ServiceType
}