import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUser } from "../api/users";

// PATCH /users/me — on success, seed the ["user","me"] cache so the
// avatar, UserPage, and profile form all reflect the update immediately.
export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: (updated) => {
      queryClient.setQueryData(["user", "me"], updated);
    },
  });
}
