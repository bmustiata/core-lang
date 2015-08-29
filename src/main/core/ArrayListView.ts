import { XArrayList } from './ArrayList';

/**
 * A list that is wrapped over an existing array, and that will
 * perform all the operations on top of the initial array.
 */
export class XArrayListView<T> extends XArrayList<T> {
    constructor(data) {
        super(null);

        this.storage = data;
    }
}
