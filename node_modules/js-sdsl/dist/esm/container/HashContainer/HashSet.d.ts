import HashContainer from './Base/index';
import Vector from '../SequentialContainer/Vector';
import OrderedSet from '../TreeContainer/OrderedSet';
import { initContainer } from "../ContainerBase/index";
declare class HashSet<K> extends HashContainer<K> {
    protected hashTable: (Vector<K> | OrderedSet<K>)[];
    constructor(container?: initContainer<K>, initBucketNum?: number, hashFunc?: (x: K) => number);
    protected reAllocate(): void;
    forEach(callback: (element: K, index: number) => void): void;
    /**
     * @description Insert element to hash set.
     * @param element The element you want to insert.
     */
    insert(element: K): void;
    eraseElementByKey(key: K): void;
    find(element: K): boolean;
    [Symbol.iterator](): Generator<K, void, unknown>;
}
export default HashSet;
