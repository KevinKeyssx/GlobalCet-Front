import { json } from '@sveltejs/kit';

import { mapProducts, mapKits, mapLabs } from '$lib/utils/entityFiles';
import type { GlobalSearchResponse } from '$lib/types/search';
import connectRequest, { isApiError } from '$lib/services/fetch.service';
import { EXTERNAL_ENDPOINTS } from '$lib/utils/endpoints';
import { ENV } from '$lib/utils/env.server';
import type { RequestHandler } from './$types';

// ─── GET Handler ─────────────────────────────────────────────────────────────
export const GET: RequestHandler = async ( { url, fetch } ) => {
	const query          = url.searchParams.get( 'query' ) || '';
	const suggestion     = url.searchParams.get( 'suggestion' ) || 'true';
	const page           = url.searchParams.get( 'page' ) || '1';
	const size           = url.searchParams.get( 'size' ) || '10';
	const orderBy        = url.searchParams.get( 'orderBy' ) || '';
	const order          = url.searchParams.get( 'order' ) || '';
	const filter         = url.searchParams.get( 'filter' ) || '';
	const categories     = url.searchParams.get( 'categories' ) || '';
	const subcategories  = url.searchParams.get( 'subcategories' ) || '';
	const materialIds    = url.searchParams.get( 'materialIds' ) || '';

	const params = new URLSearchParams( {
		suggestion   : suggestion,
		page         : page,
		size         : size,
		includeFiles : 'true',
	} );

	if ( query ) {
		params.set( 'query', query );
	}
	if ( orderBy ) {
		params.set( 'orderBy', orderBy );
	}
	if ( order ) {
		params.set( 'order', order );
	}
	if ( filter ) {
		params.set( 'filter', filter );
	}
	if ( categories ) {
		params.set( 'categories', categories );
	}
	if ( subcategories ) {
		params.set( 'subcategories', subcategories );
	}
	if ( materialIds ) {
		params.set( 'materialIds', materialIds );
	}

	const response = await connectRequest< GlobalSearchResponse >( {
		endpoint   : `${ EXTERNAL_ENDPOINTS.GLOBAL_SEARCH.BASE }?${ params.toString() }`,
		isInternal : false,
		headers    : {
			'x-secret' : ENV.INTERNAL_SECRET_KEY,
		},
		fetch,
	} );

	if ( isApiError( response ) ) {
		return json( { error : response.message }, { status : response.status || 500 } );
	}

	// Reconstruct media attachment URLs dynamically using shared list mappers
	const mappedResponse: GlobalSearchResponse = {
		products	: mapProducts( response.products || [] ),
		kits		: mapKits( response.kits || [] ),
		mobileLabs	: mapLabs( response.mobileLabs || [] ),
		meta			: response.meta,
		suggestions	: response.suggestions
			? {
				products	: mapProducts( response.suggestions.products || [] ),
				kits		: mapKits( response.suggestions.kits || [] ),
				mobileLabs	: mapLabs( response.suggestions.mobileLabs || [] ),
			}
			: undefined,
	};

	return json( mappedResponse );
};
