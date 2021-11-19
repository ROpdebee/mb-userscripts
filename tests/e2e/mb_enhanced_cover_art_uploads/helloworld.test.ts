Feature('Hello World Test');

Scenario('hello world', ({ I }) => {
    I.amOnPage('/');
    I.see('Log In');
});
