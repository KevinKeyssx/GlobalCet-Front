import { json }                         from '@sveltejs/kit';

import { mapLabs }                      from '$lib/utils/entityFiles';
import connectRequest, { isApiError }   from '$lib/services/fetch.service';
import { EXTERNAL_ENDPOINTS }           from '$lib/utils/endpoints';
import { ENV }                          from '$lib/utils/env.server';
import type { RequestHandler }          from './$types';
import type { GlobalSearchMobileLab }   from '$lib/types/search';

// ─── GET Handler: Fetch a single mobile lab by ID ──────────────────────────────
export const GET: RequestHandler = async ( { url, fetch } ) => {
	const id = url.searchParams.get( 'id' ) || '';

	if ( !id ) {
		return json( { error : 'Missing mobile lab ID' }, { status : 400 } );
	}

	try {
		const response = await connectRequest< GlobalSearchMobileLab >( {
			endpoint   : `${ EXTERNAL_ENDPOINTS.LABS.BASE }/${ id }?includeFiles=true&includeProducts=true&includeKits=true`,
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
		const [ mappedLab ] = mapLabs( [ response ] );

		return json( mappedLab );
	} catch ( error : any ) {
		const status  = error.status || 500;
		let message = 'Ocurrió un error inesperado al procesar la solicitud.';

		if ( status === 404 ) {
			message = 'El laboratorio móvil solicitado no existe o no está disponible.';
		} else if ( status === 400 ) {
			message = 'La solicitud del laboratorio móvil es inválida.';
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
