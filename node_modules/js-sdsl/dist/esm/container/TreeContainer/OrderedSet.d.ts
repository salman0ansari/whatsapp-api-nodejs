import TreeContainer from './Base/index';
import { initContainer } from "../ContainerBase/index";
import TreeIterator from './Base/TreeIterator';
export declare class OrderedSetIterator<K> extends TreeIterator<K, undefined> {
    get pointer(): K;
    copy(): OrderedSetIterator<K>;
}
declare class OrderedSet<K> extends TreeContainer<K, undefined> {
    constructor(container?: initContainer<K>, cmp?: (x: K, y: K) => number);
    private readonly iterationFunc;
    begin(): OrderedSetIterator<K>;
    end(): OrderedSetIterator<K>;
    rBegin(): OrderedSetIterator<K>;
    rEnd(): OrderedSetIterator<K>;
    front(): K | undefined;
    back(): K | undefined;
    forEach(callback: (element: K, index: number) => void): void;
    getElementByPos(pos: number): K;
    /**
     * @description Insert element to set.
     * @param key The key want to insert.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     */
    insert(key: K, hint?: OrderedSetIterator<K>): void;
    find(element: K): OrderedSetIterator<K>;
    lowerBound(key: K): OrderedSetIterator<K>;
    upperBound(key: K): OrderedSetIterator<K>;
    reverseLowerBound(key: K): OrderedSetIterator<K>;
    reverseUpperBound(key: K): OrderedSetIterator<K>;
    union(other: OrderedSet<K>): void;
    [Symbol.iterator](): Generator<K, void, undefined>;
}
export default OrderedSet;
