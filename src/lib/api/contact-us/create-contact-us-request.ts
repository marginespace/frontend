import { useMutation } from '@tanstack/react-query';

import { adminClient } from '@/lib/api/client';

export const CREATE_CONTACT_US_REQUEST = '/api/contact-us';

export interface CreateContactUsReturnType {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
}

export interface CreateContactUsRequestParams {
  name: string;
  email: string;
  message: string;
}

export const createContactUsRequest = async (
  params: CreateContactUsRequestParams,
) => {
  const response = await adminClient.post<CreateContactUsReturnType>(
    CREATE_CONTACT_US_REQUEST,
    params,
  );

  if (response.status >= 200 && response.status < 300) {
    return response.data as CreateContactUsReturnType;
  }

  return null;
};

export const useCreateContactUsRequest = () => {
  const { mutateAsync } = useMutation({
    mutationKey: ['createContactUsRequest'],
    mutationFn: createContactUsRequest,
  });

  return { createContactUsRequestAsync: mutateAsync };
};
