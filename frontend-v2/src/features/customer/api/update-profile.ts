import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { customerQueryKey } from '@/features/customer/api/query-keys';
import type { UpdateCustomerProfileDto } from '@/features/customer/domain/customer-dto';
import type { UpdateProfile } from '@/features/customer/domain/customer-state';
import { mapUpdateProfileToDto } from '@/features/customer/domain/customer-transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const updateProfile = (updateProfileDto: UpdateCustomerProfileDto) => {
  return http.put(USER_ENDPOINTS.UPDATE_PROFILE, updateProfileDto);
};

type UseUpdateCustomerProfileMutationOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, UpdateProfile, unknown>;
};

export const useUpdateCustomerProfile = ({
  mutationConfig,
}: UseUpdateCustomerProfileMutationOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: (updateProfileData: UpdateProfile) => {
      const dto = mapUpdateProfileToDto(updateProfileData);
      return updateProfile(dto);
    },
    onSuccess: (data, variables, result, context) => {
      queryClient.invalidateQueries({ queryKey: customerQueryKey.profile() });
      onSuccess?.(data, variables, result, context);
    },
    ...restConfig,
  });
};
