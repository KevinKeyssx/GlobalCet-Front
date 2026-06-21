import { writable } from 'svelte/store';

import toast from 'svelte-french-toast';

import {
    getStorageItem,
    setStorageItem
}                           from '$lib/utils/storage';
import { getItemImages }    from '$lib/utils/image';


export interface QuoteItem {
	id             : string;
	type           : 'product' | 'kit' | 'lab';
	name           : string;
	sku            : string;
	currentPrice?  : number;
	formattedPrice?: string;
	imageUrl       : string;
	quantity       : number;
}


const STORAGE_KEY = 'globalcet_quote_cart';


function createQuoteStore() {
	const initialItems = getStorageItem<QuoteItem[]>( STORAGE_KEY ) || [ ];
	const { subscribe, set, update } = writable<QuoteItem[]>( initialItems );

	return {
		subscribe,
		addItem : ( item: any, type: 'product' | 'kit' | 'lab', quantity = 1 ): void => {
			update( ( items ) => {
				const existing = items.find( ( i ) => i.id === item.id );
				if ( existing ) {
					return items;
				}

				const images = getItemImages( item );
				const imageUrl = images.length > 0 ? images[ 0 ] : '';

				const newItem: QuoteItem = {
					id             : item.id,
					type           : type,
					name           : item.name,
					sku            : item.sku || 'N/A',
					currentPrice   : item.currentPrice,
					formattedPrice : item.formattedPrice,
					imageUrl       : imageUrl,
					quantity       : Math.max( 1, quantity ),
				};

				const newItems = [ ...items, newItem ];
				setStorageItem( STORAGE_KEY, newItems );
				toast.success( 'Producto añadido a la cotización con éxito.' );
				return newItems;
			} );
		},
		removeItem : ( id: string ): void => {
			update( ( items ) => {
				const newItems = items.filter( ( i ) => i.id !== id );
				setStorageItem( STORAGE_KEY, newItems );
				return newItems;
			} );
		},
		updateQuantity : ( id: string, quantity: number ): void => {
			update( ( items ) => {
				const newItems = items.map( ( i ) => {
					if ( i.id === id ) {
						return { ...i, quantity : Math.max( 1, quantity ) };
					}
					return i;
				} );
				setStorageItem( STORAGE_KEY, newItems );
				return newItems;
			} );
		},
		clear : (): void => {
			set( [ ] );
			setStorageItem( STORAGE_KEY, [ ] );
		},
		isInQuote : ( id: string, list: QuoteItem[] ): boolean => {
			return list.some( ( i ) => i.id === id );
		}
	};
}

export const quoteStore = createQuoteStore();
