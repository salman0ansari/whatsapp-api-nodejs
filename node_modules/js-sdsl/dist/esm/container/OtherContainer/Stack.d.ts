import { Base, initContainer } from "../ContainerBase/index";
declare class Stack<T> extends Base {
    private stack;
    constructor(container?: initContainer<T>);
    clear(): void;
    /**
     * @description Insert element to stack's end.
     */
    push(element: T): void;
    /**
     * @description Removes the end element.
     */
    pop(): void;
    /**
     * @description Accesses the end element.
     */
    top(): T | undefined;
}
export default Stack;
