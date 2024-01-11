import TreeNode from './TreeNode';
import TreeIterator from './TreeIterator';
import { Container } from "../../ContainerBase/index";
declare abstract class TreeContainer<K, V> extends Container<K | [K, V]> {
    protected root: TreeNode<K, V> | undefined;
    protected header: TreeNode<K, V>;
    protected cmp: (x: K, y: K) => number;
    protected constructor(cmp?: (x: K, y: K) => number);
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is greater than or equals to the given key.
     * @protected
     */
    protected _lowerBound(curNode: TreeNode<K, V> | undefined, key: K): TreeNode<K, V>;
    /**
     * @param key The given key you want to compare.
     * @return An iterator to the first element not less than the given key.
     */
    abstract lowerBound(key: K): TreeIterator<K, V>;
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is greater than the given key.
     * @protected
     */
    protected _upperBound(curNode: TreeNode<K, V> | undefined, key: K): TreeNode<K, V>;
    /**
     * @param key The given key you want to compare.
     * @return An iterator to the first element greater than the given key.
     */
    abstract upperBound(key: K): TreeIterator<K, V>;
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is less than or equals to the given key.
     * @protected
     */
    protected _reverseLowerBound(curNode: TreeNode<K, V> | undefined, key: K): TreeNode<K, V>;
    /**
     * @param key The given key you want to compare.
     * @return An iterator to the first element not greater than the given key.
     */
    abstract reverseLowerBound(key: K): TreeIterator<K, V>;
    /**
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @return TreeNode which key is less than the given key.
     * @protected
     */
    protected _reverseUpperBound(curNode: TreeNode<K, V> | undefined, key: K): TreeNode<K, V>;
    /**
     * @param key The given key you want to compare.
     * @return An iterator to the first element less than the given key.
     */
    abstract reverseUpperBound(key: K): TreeIterator<K, V>;
    /**
     * @description Union the other tree to self.
     *              <br/>
     *              Waiting for optimization, this is O(mlog(n+m)) algorithm now,
     *              but we expect it to be O(mlog(n/m+1)).<br/>
     *              More information =>
     *              https://en.wikipedia.org/wiki/Red_black_tree
     *              <br/>
     * @param other The other tree container you want to merge.
     */
    abstract union(other: TreeContainer<K, V>): void;
    /**
     * @description Make self balance after erase a node.
     * @param curNode The node want to remove.
     * @protected
     */
    protected eraseNodeSelfBalance(curNode: TreeNode<K, V>): void;
    /**
     * @description Remove a node.
     * @param curNode The node you want to remove.
     * @protected
     */
    protected eraseNode(curNode: TreeNode<K, V>): void;
    /**
     * @description InOrder traversal the tree.
     * @protected
     */
    protected inOrderTraversal: (curNode: TreeNode<K, V> | undefined, callback: (curNode: TreeNode<K, V>) => boolean) => boolean;
    /**
     * @description Make self balance after insert a node.
     * @param curNode The node want to insert.
     * @protected
     */
    protected insertNodeSelfBalance(curNode: TreeNode<K, V>): void;
    /**
     * @description Find node which key is equals to the given key.
     * @param curNode The starting node of the search.
     * @param key The key you want to search.
     * @protected
     */
    protected findElementNode(curNode: TreeNode<K, V> | undefined, key: K): TreeNode<K, V> | undefined;
    /**
     * @description Insert a key-value pair or set value by the given key.
     * @param key The key want to insert.
     * @param value The value want to set.
     * @param hint You can give an iterator hint to improve insertion efficiency.
     * @protected
     */
    protected set(key: K, value?: V, hint?: TreeIterator<K, V>): void;
    clear(): void;
    /**
     * @description Update node's key by iterator.
     * @param iter The iterator you want to change.
     * @param key The key you want to update.
     * @return Boolean about if the modification is successful.
     */
    updateKeyByIterator(iter: TreeIterator<K, V>, key: K): boolean;
    eraseElementByPos(pos: number): void;
    /**
     * @description Remove the element of the specified key.
     * @param key The key you want to remove.
     */
    eraseElementByKey(key: K): void;
    eraseElementByIterator(iter: TreeIterator<K, V>): TreeIterator<K, V>;
    /**
     * @description Get the height of the tree.
     * @return Number about the height of the RB-tree.
     */
    getHeight(): number;
}
export default TreeContainer;
