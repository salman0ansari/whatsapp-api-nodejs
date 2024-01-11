import { Base, initContainer } from "../ContainerBase/index";
declare class Queue<T> extends Base {
    private queue;
    constructor(container?: initContainer<T>);
    clear(): void;
    /**
     * @description Inserts element to queue's end.
     */
    push(element: T): void;
    /**
     * @description Removes the first element.
     */
    pop(): void;
    /**
     * @description Access the first element.
     */
    front(): T | undefined;
}
export default Queue;
