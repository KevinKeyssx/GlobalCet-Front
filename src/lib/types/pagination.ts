export interface PaginationMeta<T> {
    data    : T,
    meta    : {
        total       : number;
        page        : number;
        size        : number;
        totalPages  : number
    }
}
