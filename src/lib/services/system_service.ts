import { doApiCall } from "$lib/core/api";
import { createQuery } from "@tanstack/svelte-query";

export const useHealthCheck = () =>
  createQuery(() => ({
    queryKey: ["health-check"],
    queryFn: async () => {
      const response = await doApiCall("health");
      if (response.success) {
        return true;
      }
      return false;
    },
  }));
