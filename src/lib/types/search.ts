export interface FileAttachment {
	id             : string;
	url            : string;
	alt            : string | null;
	isMain         : boolean;
	order          : number;
	attachmentType : 'IMAGE' | 'VIDEO' | 'DOCUMENT';
}

export interface CategoryInfo {
	id   : string;
	name : string;
}

export interface SubcategoryInfo {
	id       : string;
	name     : string;
	category : CategoryInfo;
}

export interface MaterialInfo {
	id   : string;
	name : string;
	slug : string;
}

export interface GlobalSearchProduct {
	id             : string;
	sku            : string;
	name           : string;
	description    : string;
	active         : boolean;
	createdAt      : string;
	updatedAt      : string;
	files          : FileAttachment[];
	subcategory    : SubcategoryInfo;
	material       : MaterialInfo;
	currentPrice?  : number;
	formattedPrice?: string;
}

export interface ProductRelationInfo {
	id   : string;
	name : string;
	sku  : string;
}

export interface GlobalSearchKitProduct {
	quantity : number;
	product  : ProductRelationInfo;
}

export interface GlobalSearchKit {
	id             : string;
	sku            : string;
	name           : string;
	description    : string;
	active         : boolean;
	createdAt      : string;
	updatedAt      : string;
	files          : FileAttachment[];
	category       : CategoryInfo;
	products       : GlobalSearchKitProduct[];
	currentPrice?  : number;
	formattedPrice?: string;
}

export interface KitRelationInfo {
	id   : string;
	name : string;
	sku  : string;
}

export interface GlobalSearchMobileLabKit {
	id       : string;
	quantity : number;
	kit      : KitRelationInfo;
}

export interface GlobalSearchMobileLab {
	id             : string;
	sku            : string;
	name           : string;
	description    : string;
	dimensions     : string;
	active         : boolean;
	createdAt      : string;
	updatedAt      : string;
	files          : FileAttachment[];
	category       : CategoryInfo;
	kits           : GlobalSearchMobileLabKit[];
	products       : GlobalSearchKitProduct[];
	currentPrice?  : number;
	formattedPrice?: string;
}

export interface GlobalSearchMeta {
	totalProducts   : number;
	totalKits       : number;
	totalMobileLabs : number;
	isSuggestion    : boolean;
}

export interface GlobalSearchResponse {
	products     : GlobalSearchProduct[];
	kits         : GlobalSearchKit[];
	mobileLabs   : GlobalSearchMobileLab[];
	meta         : GlobalSearchMeta;
	suggestions? : {
		products   : GlobalSearchProduct[];
		kits       : GlobalSearchKit[];
		mobileLabs : GlobalSearchMobileLab[];
	};
}

export enum QuoteStatus {
	PENDING        = 'PENDING',
	IN_REVIEW      = 'IN_REVIEW',
	SENT_TO_CLIENT = 'SENT_TO_CLIENT',
	ACCEPTED       = 'ACCEPTED',
	REJECTED       = 'REJECTED',
	COMPLETED      = 'COMPLETED',
	CANCELLED      = 'CANCELLED'
}

export interface CreateQuoteItem {
	id       : string;
	quantity : number;
}

export interface CreateQuoteItems {
	products?   : CreateQuoteItem[];
	kits?       : CreateQuoteItem[];
	mobileLabs? : CreateQuoteItem[];
}

export interface CreateQuoteClientData {
	companyName : string;
	rut         : string;
	address     : string;
	email       : string;
	contactName : string;
	phoneNumber : string;
}

export interface CreateQuoteRequest {
	clientData : CreateQuoteClientData;
	items      : CreateQuoteItems;
}

export interface CreateQuoteResponse {
	id          : string;
	quoteNumber : string;
	status      : QuoteStatus;
	createdAt   : string;
	updatedAt   : string;
}
