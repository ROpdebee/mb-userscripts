import 'core-js/modules/esnext.map.group-by';

function $(strings) {
    return document.querySelector(strings[0]);
}

class Test {
    test() {
        return $('.test');
    }
}

new Test().test();

Map.groupBy(['a dog', 'a cat', 'the mouse'], (val) => val[0]);
