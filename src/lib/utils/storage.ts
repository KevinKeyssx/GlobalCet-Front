import { browser } from '$app/environment';

import LZString from 'lz-string';


export function setStorageItem<T>( key: string, value: T ): void {
	if ( !browser ) {
		return;
	}

	try {
		const jsonString = JSON.stringify( value );
		const compressed = LZString.compressToUTF16( jsonString );

        localStorage.setItem( key, compressed );
	} catch ( e ) {
		console.error( `Error setting item in localStorage for key "${ key }":`, e );
	}
}


export function getStorageItem<T>( key: string ): T | null {
	if ( !browser ) {
		return null;
	}

	try {
		const value = localStorage.getItem( key );

        if ( !value ) {
			return null;
		}

		let decompressed = LZString.decompressFromUTF16( value );

        if ( !decompressed ) {
			decompressed = value;
		}

		return JSON.parse( decompressed ) as T;
	} catch ( e ) {
		console.error( `Error getting item from localStorage for key "${ key }":`, e );
		return null;
	}
}


export function removeStorageItem( key: string ): void {
	if ( !browser ) {
		return;
	}

	localStorage.removeItem( key );
}
