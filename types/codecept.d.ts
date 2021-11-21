/// <reference types='codeceptjs' />
/* eslint-disable @typescript-eslint/no-empty-interface */


declare namespace CodeceptJS {
    interface SupportObject {
        I: I;
        login: (user: string) => void;
    }
    interface Methods extends WebDriver {}
    interface I extends WithTranslation<Methods> {}
    namespace Translation {
        interface Actions {}
    }
}
