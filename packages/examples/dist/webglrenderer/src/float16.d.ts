declare function Dt(t: unknown): unknown;
declare function ir(t: any): any;
declare class ar {
    constructor(t: string | number | any[], r: undefined, n: undefined);
    static from(t: string | any[], ...r: any[]): ar;
    static of(...t: any): ar;
    keys(): any;
    values(): any;
    entries(): any;
    at(t: any): number | undefined;
    map(t: Function, ...r: any[]): any;
    filter(t: Function, ...r: any[]): any;
    reduce(t: (arg0: any, arg1: number, arg2: number, arg3: this) => any, ...r: any[]): any;
    reduceRight(t: (arg0: any, arg1: number, arg2: number, arg3: this) => any, ...r: any[]): any;
    forEach(t: Function, ...r: any[]): void;
    find(t: Function, ...r: any[]): number | undefined;
    findIndex(t: Function, ...r: any[]): number;
    findLast(t: Function, ...r: any[]): number | undefined;
    findLastIndex(t: Function, ...r: any[]): number;
    every(t: Function, ...r: any[]): boolean;
    some(t: Function, ...r: any[]): boolean;
    set(t: number, ...r: number[]): any;
    reverse(): this;
    fill(t: number, ...r: any[]): this;
    copyWithin(t: any, r: any, ...n: any[]): this;
    sort(...t: any): this;
    slice(...t: any): any;
    subarray(...t: any): any;
    indexOf(t: number, ...r: any[]): number;
    lastIndexOf(t: number, ...r: any[]): number;
    includes(t: unknown, ...r: any[]): boolean;
    join(...t: any): any;
    toLocaleString(...t: any): any;
}
declare function pr(t: any, r: any, ...n: any[]): number;
declare function wr(t: any, r: any, n: number, ...e: any[]): any;
export { ar as Float16Array, pr as getFloat16, Dt as hfround, ir as isFloat16Array, wr as setFloat16 };
