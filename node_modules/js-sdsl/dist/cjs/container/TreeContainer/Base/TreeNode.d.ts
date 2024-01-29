declare class TreeNode<K, V> {
    static readonly RED = true;
    static readonly BLACK = false;
    color: boolean;
    key: K | undefined;
    value: V | undefined;
    left: TreeNode<K, V> | undefined;
    right: TreeNode<K, V> | undefined;
    parent: TreeNode<K, V> | undefined;
    constructor(key?: K, value?: V);
    /**
     * @description Get the pre node.
     * @return TreeNode about the pre node.
     */
    pre(): TreeNode<K, V>;
    /**
     * @description Get the next node.
     * @return TreeNode about the next node.
     */
    next(): TreeNode<K, V>;
    /**
     * @description Rotate left.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateLeft(): TreeNode<K, V>;
    /**
     * @description Rotate left.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateRight(): TreeNode<K, V>;
    /**
     * @description Remove this.
     */
    remove(): void;
}
export default TreeNode;
