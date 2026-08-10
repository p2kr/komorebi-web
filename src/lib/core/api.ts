type SuccessResponse<T> = {
	success: true;
	data: T;
};

type FailureResponse = {
	success: false;
	error: {
		code: string;
		msg: string;
	};
};

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;
