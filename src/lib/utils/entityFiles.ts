import type {
	GlobalSearchProduct,
	GlobalSearchKit,
	GlobalSearchMobileLab,
	FileAttachment,
}               from '$lib/types/search';
import { ENV }  from '$lib/utils/env.server';

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface MapFileParams {
	file      : FileAttachment;
	entityId  : string;
	subfolder : 'products' | 'kits' | 'labs';
}

export interface EntityWithFiles {
	id    : string;
	name  : string;
	files : FileAttachment[];
}

export interface MapEntityParams {
	entity         : EntityWithFiles;
	subfolder      : 'products' | 'kits' | 'labs';
	placeholderUrl : string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getMediaTypeFolder( type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' ): string {
	if ( type === 'IMAGE' ) {
		return 'image';
	}
	if ( type === 'VIDEO' ) {
		return 'video';
	}
	return 'raw';
}

export function mapAttachment( { file, entityId, subfolder }: MapFileParams ): FileAttachment {
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

export function mapEntityFiles<T extends EntityWithFiles>( {
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

// ─── Shared Entity List Mappers ───────────────────────────────────────────────
export function mapProducts( products: GlobalSearchProduct[] ): GlobalSearchProduct[] {
	return products.map( ( p ) =>
		mapEntityFiles<GlobalSearchProduct>( {
			entity         : p,
			subfolder      : 'products',
			placeholderUrl : 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
		} )
	);
}

export function mapKits( kits: GlobalSearchKit[] ): GlobalSearchKit[] {
	return kits.map( ( k ) =>
		mapEntityFiles<GlobalSearchKit>( {
			entity         : k,
			subfolder      : 'kits',
			placeholderUrl : 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80',
		} )
	);
}

export function mapLabs( labs: GlobalSearchMobileLab[] ): GlobalSearchMobileLab[] {
	return labs.map( ( l ) =>
		mapEntityFiles<GlobalSearchMobileLab>( {
			entity         : l,
			subfolder      : 'labs',
			placeholderUrl : 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80',
		} )
	);
}
