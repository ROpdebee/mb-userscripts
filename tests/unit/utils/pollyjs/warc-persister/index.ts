import fs from 'node:fs/promises';
import path from 'node:path';

import type { Polly } from '@pollyjs/core';
import type { Har } from '@pollyjs/persister';
import Persister from '@pollyjs/persister';

import { assertHasValue } from '@lib/util/assert';

import har2warc from './har2warc';
import warc2har from './warc2har';

interface Options extends Polly {
    recordingsDir: string;
}

export class WarcPersister extends Persister<Options> {
    public static override readonly id = 'fs-warc';

    public override async onFindRecording(recordingId: string): Promise<Har | null> {
        const searchPath = this.filenameFor(recordingId);

        try {
            const warcContent = await fs.readFile(searchPath);
            return await warc2har(warcContent);
        } catch (err) {
            if (Object.prototype.hasOwnProperty.call(err, 'errno')
                && (err as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }
            throw err;
        }
    }

    public override async onSaveRecording(recordingId: string, har: Har): Promise<void> {
        const warc = await har2warc(har);
        const outPath = this.filenameFor(recordingId);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, warc);
    }

    public override async onDeleteRecording(recordingId: string): Promise<void> {
        const warcPath = this.filenameFor(recordingId);

        await fs.unlink(warcPath);
    }

    private filenameFor(recordingId: string): string {
        assertHasValue(this.options.recordingsDir);
        return path.join(this.options.recordingsDir, recordingId + '.warc');
    }
}
