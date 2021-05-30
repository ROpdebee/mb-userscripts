import 'core-js/modules/esnext.map.group-by';

function $(strings) {
    return document.querySelector(strings);
}

class Test {
    test() {
        return $('.test');
    }
}

new Test().test();

let map = Map.groupBy(['a dog', 'a cat', 'the mouse'], (val) => val[0]);

console.log(map);
