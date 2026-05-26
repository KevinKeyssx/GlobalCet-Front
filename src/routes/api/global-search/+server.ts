import { json } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import type {
	GlobalSearchResponse,
	GlobalSearchProduct,
	GlobalSearchKit,
	GlobalSearchMobileLab,
	FileAttachment,
} from '$lib/types/search';
import connectRequest, { isApiError } from '$lib/services/fetch.service';
import { EXTERNAL_ENDPOINTS } from '$lib/utils/endpoints';
import { ENV } from '$lib/utils/env.server';

// ─── Helpers ──────────────────────────────────────────────────────────────────
interface MapFileParams {
	file       : FileAttachment;
	entityId   : string;
	subfolder  : 'products' | 'kits' | 'labs';
}

function getMediaTypeFolder( type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' ): string {
	if ( type === 'IMAGE' ) {
		return 'image';
	}
	if ( type === 'VIDEO' ) {
		return 'video';
	}
	return 'raw';
}

function mapAttachment( { file, entityId, subfolder }: MapFileParams ): FileAttachment {
	if ( file.url.startsWith( 'http://' ) || file.url.startsWith( 'https://' ) ) {
		return file;
	}

	const typeFolder = getMediaTypeFolder( file.attachmentType );
	const baseUrl    = ENV.FILE_MANAGER.URL.replace( '***', typeFolder );
	const fileName   = file.url.split( '/' ).pop() || '';

	return {
		id             : file.id,
		url            : `${ baseUrl }${ subfolder }/${ entityId }/${ fileName }`,
		alt            : file.alt,
		isMain         : file.isMain,
		order          : file.order,
		attachmentType : file.attachmentType,
	};
}

interface EntityWithFiles {
	id    : string;
	name  : string;
	files : FileAttachment[];
}

interface MapEntityParams {
	entity         : EntityWithFiles;
	subfolder      : 'products' | 'kits' | 'labs';
	placeholderUrl : string;
}

function mapEntityFiles<T extends EntityWithFiles>( {
	entity,
	subfolder,
	placeholderUrl,
}: MapEntityParams ): T {
	const filesMapped = entity.files.map( ( f ) =>
		mapAttachment( { file : f, entityId : entity.id, subfolder } )
	);

	if ( filesMapped.length === 0 ) {
		filesMapped.push( {
			id             : 'placeholder',
			url            : placeholderUrl,
			alt            : entity.name,
			isMain         : true,
			order          : 0,
			attachmentType : 'IMAGE',
		} );
	}

	return {
		...entity,
		files : filesMapped,
	} as unknown as T;
}

// ─── GET Handler ─────────────────────────────────────────────────────────────
export const GET: RequestHandler = async ( { url, fetch } ) => {
	const query          = url.searchParams.get( 'query' ) || '';
	const limitPerEntity = url.searchParams.get( 'limitPerEntity' ) || '10';
	const suggestion     = url.searchParams.get( 'suggestion' ) || 'false';
	const sortBy         = url.searchParams.get( 'sortBy' ) || '';
	const sortOrder      = url.searchParams.get( 'sortOrder' ) || '';

	const params = new URLSearchParams( {
		limitPerEntity,
		suggestion,
	} );

	if ( query ) {
		params.set( 'query', query );
	}
	if ( sortBy ) {
		params.set( 'sortBy', sortBy );
	}
	if ( sortOrder ) {
		params.set( 'sortOrder', sortOrder );
	}

	const response = await connectRequest<GlobalSearchResponse>( {
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

	// Reconstruct media attachment URLs dynamically
	const products   = response.products || [];
	const kits       = response.kits || [];
	const mobileLabs = response.mobileLabs || [];

	const mappedProducts = products.map( ( p: GlobalSearchProduct ): GlobalSearchProduct =>
		mapEntityFiles<GlobalSearchProduct>( {
			entity         : p,
			subfolder      : 'products',
			placeholderUrl : 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
		} )
	);

	const mappedKits = kits.map( ( k: GlobalSearchKit ): GlobalSearchKit =>
		mapEntityFiles<GlobalSearchKit>( {
			entity         : k,
			subfolder      : 'kits',
			placeholderUrl : 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
		} )
	);

	const mappedLabs = mobileLabs.map( ( l: GlobalSearchMobileLab ): GlobalSearchMobileLab =>
		mapEntityFiles<GlobalSearchMobileLab>( {
			entity         : l,
			subfolder      : 'labs',
			placeholderUrl : 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
		} )
	);

	const mappedResponse: GlobalSearchResponse = {
		products   : mappedProducts,
		kits       : mappedKits,
		mobileLabs : mappedLabs,
		meta       : response.meta,
	};

	return json( mappedResponse );
};
