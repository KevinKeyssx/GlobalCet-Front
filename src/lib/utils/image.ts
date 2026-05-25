export function getImageUrl(
	url        : string | undefined | null,
	entityId?  : string,
	entityType?: 'products' | 'kits' | 'labs',
	name       : string = 'laboratory'
): string {
	if ( !url ) {
		const q = name.toLowerCase();
		if ( q.includes( 'kit' ) ) {
			return 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80';
		}
		if ( q.includes( 'lab' ) || q.includes( 'móvil' ) ) {
			return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80';
		}
		return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80';
	}

	if ( url.startsWith( 'http://' ) || url.startsWith( 'https://' ) ) {
		return url;
	}

	const cleanUrl = url.replace( /^\/+/, '' );

	// If it contains a slash, it's already a full path (e.g. "globalcet/products/...")
	if ( cleanUrl.includes( '/' ) ) {
		return `https://res.cloudinary.com/dtj5eqsub/image/upload/${cleanUrl}`;
	}

	// If it's just a filename and we have entity ID and type, construct the full Cloudinary path
	if ( entityId && entityType ) {
		return `https://res.cloudinary.com/dtj5eqsub/image/upload/globalcet/${entityType}/${entityId}/${cleanUrl}`;
	}

	// Fallback standard path
	return `https://res.cloudinary.com/dtj5eqsub/image/upload/globalcet/${cleanUrl}`;
}
