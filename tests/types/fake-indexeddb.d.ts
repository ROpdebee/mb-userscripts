declare module 'fake-indexeddb/auto' {

}

declare module 'fake-indexeddb/lib/FDBFactory' {
    export default class FDBFactory extends IDBFactory {}
}
