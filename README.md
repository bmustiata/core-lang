# core-lang

Classes that should be in the JavaScript language itself. The collections have full promises support

## Usage

<img src="doc/class-diagram.png">

## Collections

All collections inherit from XIterable. It returns an iterator and offers the classic Array methods of iteration,
also filter, map/reduce, etc. with the same signature.

In addition some methods are added (some of them inspired from groovy) to make chaining more easier (such as `groupBy`,
`transform`, `first` or `butFirst`).

Last but not least the collections have full `Promise`s support, and allow processing of their content using the `Promise`
API. For example, assuming that our collection contains promises, we can:

```javascript
list([1,2,3,4])
    .map(Promise.resolve) // make them promises
    .mapPromise(function(it) {
        // mapPromise first resolves the items in the collection,
        // then it applies the mapping function
        // all the items are resolved at his stage, so we have the initial
        // array, being iterated over. We create new promises.
        return Promise.resolve(it * it);
    }).then(function(collection) {
        // not only the value before mapping gets resolved, but also
        // the result gets first Promise.resolved and only after
        // added back into the collection
        assert.equal([1,4,9,16], collection.asArray());
    });
```
