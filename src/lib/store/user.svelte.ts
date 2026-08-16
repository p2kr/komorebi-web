import { StorageKeys } from "$lib/core/constants";
import type { User } from "$lib/models/user";
import localforage from "localforage";

class UserStore {
	#users: User[] = $state([]);
	#currentUser: User | undefined = $state(undefined);

	get users() {
		return this.#users;
	}

	get currentUser() {
		return this.#currentUser;
	}

	async setUsers(users: User[]) {
		this.#users = users;
		await this.updateCurrentUser();
	}

	private async updateCurrentUser() {
		// fetch existing current user
		const existingUserId = await localforage.getItem<string>(StorageKeys.CURRENT_USER_ID);
		// check if existing usr id is present in new users list. if not create new current user from latest user
		const doesUserExist = this.users.find((user) => user.id === existingUserId);
		if (!doesUserExist) {
			// remove from key and update with latest user
			await localforage.removeItem(StorageKeys.CURRENT_USER_ID);
			if (this.users.length > 0) {
				this.#currentUser = this.users[0];
				await localforage.setItem(StorageKeys.CURRENT_USER_ID, this.#currentUser.id);
			} else {
				this.#currentUser = undefined;
			}
		} else {
			this.#currentUser = doesUserExist;
		}
	}

	async setCurrentUser(user: User) {
		const doesUserExist = this.users.find((u) => u.id === user.id);
		if (!doesUserExist) {
			return;
		}

		await localforage.setItem(StorageKeys.CURRENT_USER_ID, user.id);
		this.#currentUser = user;
	}
}

export const userStore = new UserStore();
