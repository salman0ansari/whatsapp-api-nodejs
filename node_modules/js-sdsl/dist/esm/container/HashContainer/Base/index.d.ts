import { Base, Container } from "../../ContainerBase/index";
declare abstract class HashContainer<K> extends Base {
    protected static readonly sigma = 0.75;
    protected static readonly treeifyThreshold = 8;
    protected static readonly untreeifyThreshold = 6;
    protected static readonly minTreeifySize = 64;
    protected static readonly maxBucketNum: number;
    protected bucketNum: number;
    protected initBucketNum: number;
    protected hashFunc: (x: K) => number;
    protected abstract hashTable: Container<unknown>[];
    protected constructor(initBucketNum?: number, hashFunc?: (x: K) => number);
    clear(): void;
    /**
     * @description Growth the hash table.
     * @protected
     */
    protected abstract reAllocate(): void;
    abstract forEach(callback: (element: unknown, index: number) => void): void;
    /**
     * @description Remove the elements of the specified value.
     * @param key The element you want to remove.
     */
    abstract eraseElementByKey(key: K): void;
    /**
     * @param key The element you want to find.
     * @return Boolean about if the specified element in the hash set.
     */
    abstract find(key: K): void;
    abstract [Symbol.iterator](): Generator<unknown, void, undefined>;
}
export default HashContainer;
