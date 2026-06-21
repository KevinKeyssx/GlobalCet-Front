import { json } from '@sveltejs/kit';

import type {
    CreateQuoteRequest,
    CreateQuoteResponse
}                                       from '$lib/types/search';
import connectRequest, { isApiError }   from '$lib/services/fetch.service';
import { EXTERNAL_ENDPOINTS }           from '$lib/utils/endpoints';
import { ENV }                          from '$lib/utils/env.server';
import { METHOD }                       from '$lib/services/http-codes';
import type { RequestHandler }          from './$types';


export const POST: RequestHandler = async ( { request, fetch } ) => {
	try {
		const body = await request.json() as CreateQuoteRequest;

		const response = await connectRequest<CreateQuoteResponse>({
			method     : METHOD.POST,
			endpoint   : EXTERNAL_ENDPOINTS.QUOTES.BASE,
			body       : body,
			isInternal : false,
			headers    : {
				'x-secret' : ENV.INTERNAL_SECRET_KEY,
			},
			fetch,
		});

		if ( isApiError( response )) {
			throw response;
		}

		return json( response );
	} catch ( error: any ) {
		const status  = error.status || 500;
		const message = error.message || 'Ocurrió un error inesperado al procesar la cotización.';

		return json(
			{
				error : message,
				code  : error.code || `HTTP_${ status }`,
			},
			{ status }
		);
	}
};
