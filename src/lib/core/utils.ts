export function formToPayload(formData: FormData) {
	return JSON.stringify(Object.fromEntries(formData.entries()));
}

export async function formToPayloadAsync(formData: Promise<FormData>) {
	return JSON.stringify(Object.fromEntries((await formData).entries()));
}
