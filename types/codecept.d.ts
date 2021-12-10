/// <reference types='codeceptjs' />
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/consistent-type-imports */

type UserscriptInstaller = import('../tests/e2e/setup/UserscriptInstaller').default;
type BrowserCompat = import('../tests/e2e/setup/BrowserCompat').default;

declare namespace CodeceptJS {
    interface SupportObject {
        I: I;
        login: (user: string) => void;
    }
    interface Methods extends WebDriver, UserscriptInstaller, BrowserCompat {}
    interface I extends WithTranslation<Methods> {
        useWebDriverTo(description: string, callback: (obj: { browser: WebdriverIO.BrowserObject }) => Promise<void>): void;
    }
    namespace Translation {
        interface Actions {}
    }

    interface Helper<HelperOptions = never> {
        options: HelperOptions | undefined;
        config: HelperOptions;
    }
}
