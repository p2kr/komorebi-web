import { doApiCall } from "$lib/core/api";

type HealthCheckResponse = {
	base_url: string;
	uptime: string;
	version: string;
};

export async function healthCheck() {
	return doApiCall<HealthCheckResponse>("health");
}
