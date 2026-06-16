import { json }                         from '@sveltejs/kit';

import { mapKits }                      from '$lib/utils/entityFiles';
import connectRequest, { isApiError }   from '$lib/services/fetch.service';
import { EXTERNAL_ENDPOINTS }           from '$lib/utils/endpoints';
import { ENV }                          from '$lib/utils/env.server';
import type { RequestHandler }          from './$types';
import type { GlobalSearchKit }         from '$lib/types/search';

// ─── GET Handler: Fetch a single kit by ID ─────────────────────────────────────
export const GET: RequestHandler = async ( { url, fetch } ) => {
	const id = url.searchParams.get( 'id' ) || '';

	if ( !id ) {
		return json( { error : 'Missing kit ID' }, { status : 400 } );
	}

	try {
		const response = await connectRequest< GlobalSearchKit >( {
			endpoint   : `${ EXTERNAL_ENDPOINTS.KITS.BASE }/${ id }?includeFiles=true&includeProducts=true`,
			isInternal : false,
			headers    : {
				'x-secret' : ENV.INTERNAL_SECRET_KEY,
			},
			fetch,
		} );

		if ( isApiError( response ) ) {
			throw response;
		}

		// Reconstruct media attachments URLs using the entityFiles helper
		const [ mappedKit ] = mapKits( [ response ] );

		return json( mappedKit );
	} catch ( error : any ) {
		const status  = error.status || 500;
		let message = 'Ocurrió un error inesperado al procesar la solicitud.';

		if ( status === 404 ) {
			message = 'El kit científico solicitado no existe o no está disponible.';
		} else if ( status === 400 ) {
			message = 'La solicitud del kit científico es inválida.';
		}

		return json(
			{
				error : message,
				code  : error.code || `HTTP_${ status }`
			},
			{ status }
		);
	}
};
