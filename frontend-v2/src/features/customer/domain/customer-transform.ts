import {
  CustomerUserDtoSchema,
  type CustomersQueryDto,
  type CustomerUserDto,
  type UpdateCustomerProfileDto,
} from '@/features/customer/domain/customer-dto';
import { CustomerSchema, type CustomerListItem } from '@/features/customer/domain/customer-entity';
import { GetCurrentCustomerResponseSchema } from '@/features/customer/domain/customer-http-schema';
import type { CustomersQuery, UpdateProfile } from '@/features/customer/domain/customer-state';

/**
 * DTO → Entity (parse + transform)
 */
export const CustomerMapperSchema = GetCurrentCustomerResponseSchema.transform(
  (res) => res.data.user,
)
  .pipe(CustomerUserDtoSchema)
  .transform((dto) => ({
    id: dto._id,
    fullName: dto.fullName,
    email: dto.email,

    phoneNumber: dto.phoneNumber ?? null,
    address: dto.address ?? null,
    dateOfBirth: dto.dateOfBirth ?? null,
    // ...(dto.phoneNumber && { phoneNumber: dto.phoneNumber }),
    // ...(dto.address && { address: dto.address }),
    profilePicture: dto.profilePicture,

    status: dto.status,
    emailVerified: dto.emailVerified,
    phoneVerified: dto.phoneVerified,
    twoFactorEnabled: dto.twoFactorEnabled,

    customerInfo: {
      communicationPreferences: dto.customerInfo.communicationPreferences,
      stats: dto.customerInfo.stats,
      loyaltyPoints: dto.customerInfo.loyaltyPoints,
      membershipTier: dto.customerInfo.membershipTier,
      memberSince: new Date(dto.customerInfo.memberSince),
      isVip: dto.customerInfo.isVip,
      hasOutstandingBalance: dto.customerInfo.hasOutstandingBalance,
    },

    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  }))
  .pipe(CustomerSchema);

export const mapCustomerDtoToEntity = (dto: unknown) => CustomerMapperSchema.parse(dto);

export const mapUpdateProfileToDto = (entity: UpdateProfile): UpdateCustomerProfileDto => ({
  fullName: entity.fullName,
  phoneNumber: entity.phoneNumber ?? null,
  dateOfBirth: entity.dateOfBirth ? entity.dateOfBirth.toISOString() : null,
  address: entity.address ?? null,
});

// ==================
// Entity → DTO
// ==================
export const mapCustomersQueryToDto = (state: CustomersQuery): CustomersQueryDto => {
  return {
    search: state.search,
    limit: state.limit,
    page: state.page,
    status: state.status,
    memberShipTier: state.memberShipTier,
  };
};

export const mapCustomerListItemDtoToEntity = (dto: CustomerUserDto): CustomerListItem => {
  return {
    id: dto._id,
    fullName: dto.fullName,
    email: dto.email,
    status: dto.status,
    phoneNumber: dto.phoneNumber ?? null,
    profilePicture: dto.profilePicture.url,
    customerInfo: {
      communicationPreferences: dto.customerInfo.communicationPreferences,
      stats: dto.customerInfo.stats,
      loyaltyPoints: dto.customerInfo.loyaltyPoints,
      membershipTier: dto.customerInfo.membershipTier,
      memberSince: new Date(dto.customerInfo.memberSince),
      isVip: dto.customerInfo.isVip,
      hasOutstandingBalance: dto.customerInfo.hasOutstandingBalance,
    },
  };
};

export const mapCustomerListDtoToEntity = (dtos: CustomerUserDto[]): CustomerListItem[] => {
  return dtos.map((dto) => mapCustomerListItemDtoToEntity(dto));
};
