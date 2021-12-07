/// <reference types='codeceptjs' />

declare namespace WebdriverIO {
    interface BrowserObject {
        waitUntilNumberOfWindows(numberOfWindows: number, waitUntilOptions?: WebdriverIO.WaitUntilOptions): Promise<void>;
        pasteText(text: string): Promise<void>;
    }
}
