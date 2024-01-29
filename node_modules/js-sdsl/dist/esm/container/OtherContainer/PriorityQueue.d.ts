import { Base, initContainer } from "../ContainerBase/index";
declare class PriorityQueue<T> extends Base {
    private readonly priorityQueue;
    private readonly cmp;
    /**
     * @description PriorityQueue's constructor.
     * @param container Initialize container, must have a forEach function.
     * @param cmp Compare function.
     * @param copy When the container is an array, you can choose to directly operate on the original object of
     *             the array or perform a shallow copy. The default is shallow copy.
     */
    constructor(container?: initContainer<T>, cmp?: (x: T, y: T) => number, copy?: boolean);
    /**
     * @description Adjusting parent's children to suit the nature of the heap.
     * @param parent Parent's index.
     * @private
     */
    private adjust;
    clear(): void;
    /**
     * @description Push element into a container in order.
     * @param element The element you want to push.
     */
    push(element: T): void;
    /**
     * @description Removes the top element.
     */
    pop(): void;
    /**
     * @description Accesses the top element.
     */
    top(): T | undefined;
}
export default PriorityQueue;
