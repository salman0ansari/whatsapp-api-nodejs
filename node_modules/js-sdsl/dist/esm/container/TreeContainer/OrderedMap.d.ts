import { initContainer } from "../ContainerBase/index";
import TreeContainer from './Base/index';
import TreeIterator from './Base/TreeIterator';
export declare class OrderedMapIterator<K, V> extends TreeIterator<K, V> {
    get pointer(): [K, V];
    copy(): OrderedMapIterator<K, V>;
}
declare class OrderedMap<K, V> extends TreeContainer<K, V> {
    constructor(container?: initContainer<[K, V]>, cmp?: (x: K, y: K) => number);
    private readonly iterationFunc;
    begin(): OrderedMapIterator<K, V>;
    end(): OrderedMapIterator<K, V>;
    rBegin(): OrderedMapIterator<K, V>;
    rEnd(): OrderedMapIterator<K, V>;
    front(): [K, V] | undefined;
    back(): [K, V] | undefined;
    forEach(callback: (element: [K, V], index: number) => void): void;
    lowerBound(key: K): OrderedMapIterator<K, V>;
    upperBound(key: K): OrderedMapIterator<K, V>;
    reverseLowerBound(key: K): OrderedMapIterator<K, V>;
    reverseUpperBound(key: K): OrderedMapIterator<K, V>;
    /**
     * @description Insert a key-value pair or set value by the given key.
     * @param key The key want to insert.
     * @param value The value want to set.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    setElement(key: K, value: V, hint?: OrderedMapIterator<K, V>): void;
    find(key: K): OrderedMapIterator<K, V>;
    /**
     * @description Get the value of the element of the specified key.
     */
    getElementByKey(key: K): V | undefined;
    getElementByPos(pos: number): [K, V];
    union(other: OrderedMap<K, V>): void;
    [Symbol.iterator](): Generator<[K, V], void, undefined>;
}
export default OrderedMap;
