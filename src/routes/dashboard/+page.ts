import { doApiCall, type ApiResponse, type FailureResponse } from "$lib/core/api";
import { logger } from "$lib/core/telemetry";
import type { PaginatedResponse } from "$lib/models/media";
import { userStore } from "$lib/store/user.svelte";
import type { PageLoad } from "./$types";
import { dashboardStore } from "./dashboard.svelte";

export const load: PageLoad = async ({ depends }) => {
	depends("dashboard:all");
	return {
		dashboardItems: await getDashboardItems()
	};
};

// pub struct MediaClientParams {
//     pub user_id: Uuid,
//     pub status: Option<String>,
//     pub sort: Option<String>,
//     pub limit: Option<i32>,
//     pub offset: Option<i32>,
// }
async function getDashboardItems(): Promise<ApiResponse<PaginatedResponse>> {
	const mediaType = dashboardStore.filters.media_type;
	const user_id = userStore.currentUser?.id;
	const status = dashboardStore.filters.status || undefined;

	if (!mediaType || !user_id) {
		return {
			success: false,
			error: {
				code: "missing_params",
				msg: "media_type and user_id are required"
			}
		} as FailureResponse;
	}
	const payload = {
		...dashboardStore.filters,
		status,
		user_id
	};

	const resp = await doApiCall<PaginatedResponse>("media/" + mediaType.toLowerCase(), payload);

	logger.debug("fetched", mediaType, "with", resp, "and", payload);

	return resp;
}
