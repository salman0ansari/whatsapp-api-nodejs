import { ContainerIterator } from "../../ContainerBase/index";
export declare abstract class RandomIterator<T> extends ContainerIterator<T> {
    protected node: number;
    protected readonly size: () => number;
    protected readonly getElementByPos: (pos: number) => T;
    protected readonly setElementByPos: (pos: number, element: T) => void;
    pre: () => this;
    next: () => this;
    constructor(index: number, size: () => number, getElementByPos: (pos: number) => T, setElementByPos: (pos: number, element: T) => void, iteratorType?: boolean);
    get pointer(): T;
    set pointer(newValue: T);
    equals(obj: RandomIterator<T>): boolean;
}
