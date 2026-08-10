import type { User } from "$lib/models/user";

class UserStore {
  users: User[] = $state([]);
	currentUser: User | undefined = $state(undefined);
}

export const userStore = new UserStore();
