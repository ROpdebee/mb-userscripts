/// <reference types='codeceptjs' />
/* eslint-disable @typescript-eslint/no-empty-interface */


declare namespace WebdriverIO {
    interface BrowserObject {
        waitUntilNumberOfWindows(numberOfWindows: number, waitUntilOptions?: WebdriverIO.WaitUntilOptions): Promise<void>;
    }
}
