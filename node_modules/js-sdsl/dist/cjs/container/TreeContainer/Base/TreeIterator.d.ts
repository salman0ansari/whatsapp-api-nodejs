import TreeNode from './TreeNode';
import { ContainerIterator } from "../../ContainerBase/index";
declare abstract class TreeIterator<K, V> extends ContainerIterator<K | [K, V]> {
    protected node: TreeNode<K, V>;
    protected header: TreeNode<K, V>;
    pre: () => this;
    next: () => this;
    constructor(node: TreeNode<K, V>, header: TreeNode<K, V>, iteratorType?: boolean);
    equals(obj: TreeIterator<K, V>): boolean;
}
export default TreeIterator;
