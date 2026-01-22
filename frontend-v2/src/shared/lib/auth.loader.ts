import type { QueryClient } from '@tanstack/react-query';
import { redirect, type ClientLoaderFunction } from 'react-router';

import { paths } from '@/shared/config/paths';
import { STORAGE_KEYS } from '@/shared/constant';
import { storage } from '@/shared/lib/storage';

export const protectedLoader =
  (loader: ClientLoaderFunction): ClientLoaderFunction =>
  async (args) => {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      throw redirect(paths.auth.login.getHref(new URL(args.request.url).pathname));
    }
    return loader(args);
  };

export const privateClientLoader = (_queryClient: QueryClient, loader: ClientLoaderFunction) =>
  protectedLoader(loader);

export const requireAuthLoader: ClientLoaderFunction = async ({ request }) => {
  const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    throw redirect(paths.auth.login.getHref(new URL(request.url).pathname));
  }

  return null;
};

export const guestOnlyLoader =
  (loader?: ClientLoaderFunction): ClientLoaderFunction =>
  async (args) => {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      throw redirect(paths.root.path);
    }

    return loader ? loader(args) : null;
  };

export const publicClientLoader = (loader?: ClientLoaderFunction) => guestOnlyLoader(loader);
