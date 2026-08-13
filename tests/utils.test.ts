import { formToPayload } from "$lib/core/utils";
import { describe, expect, it } from "vitest";

describe("utils test", () => {
	it("formToPayload", () => {
		const formData = new FormData();
		formData.append("username", "testuser");
		formData.append("access_token", "testtoken");

		const res = formToPayload(formData);

		expect(res).toBe(JSON.stringify({ username: "testuser", access_token: "testtoken" }));
	});
});
