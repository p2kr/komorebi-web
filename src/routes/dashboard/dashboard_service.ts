import { doApiCall, type ApiResponse, type FailureResponse } from "$lib/core/api";
import { logger } from "$lib/core/telemetry";
import type { PaginatedResponse } from "$lib/models/media";
import type { MediaClientParams } from "./dashboard_config";

// pub struct MediaClientParams {
//     pub user_id: Uuid,
//     pub status: Option<String>,
//     pub sort: Option<String>,
//     pub limit: Option<i32>,
//     pub offset: Option<i32>,
// }
export async function getDashboardItems(
	user_id: string | undefined,
	filters: MediaClientParams
): Promise<ApiResponse<PaginatedResponse>> {
	if (!filters.media_type || !user_id) {
		return {
			success: false,
			error: {
				code: "MISSING_PARAMS",
				msg: "media_type and user_id are required"
			}
		} as FailureResponse;
	}
	const payload = {
		...filters,
		status: filters.status,
		user_id
	};

	const resp = await doApiCall<PaginatedResponse>(
		"media/" + filters.media_type.toLowerCase(),
		payload
	);

	logger.debug("fetched", filters.media_type, "with", resp, "and", payload);

	return resp;
}
