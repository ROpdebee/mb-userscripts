import path from 'path';
import fs from 'fs/promises';
import type { Polly } from '@pollyjs/core';
import Persister from '@pollyjs/persister';
import type { Har } from '@pollyjs/persister';
import har2warc from './har2warc';
import warc2har from './warc2har';
import { assertHasValue } from '@lib/util/assert';

interface Options extends Polly {
    recordingsDir: string;
}

export class WarcPersister extends Persister<Options> {

    static override get id(): string {
        return 'fs-warc';
    }

    override async onFindRecording(recordingId: string): Promise<Har | null> {
        const searchPath = this.filenameFor(recordingId);

        try {
            const warcContent = await fs.readFile(searchPath);
            const har = await warc2har(warcContent);
            return har;
        } catch (err) {
            if (Object.prototype.hasOwnProperty.call(err, 'errno')
                && (err as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }
            throw err;
        }
    }

    override async onSaveRecording(recordingId: string, har: Har): Promise<void> {
        const warc = await har2warc(har);
        const outPath = this.filenameFor(recordingId);
        await fs.mkdir(path.dirname(outPath), { recursive: true });
        await fs.writeFile(outPath, warc);
    }

    override async onDeleteRecording(recordingId: string): Promise<void> {
        const path = this.filenameFor(recordingId);

        await fs.unlink(path);
    }

    filenameFor(recordingId: string): string {
        assertHasValue(this.options.recordingsDir);
        return path.join(this.options.recordingsDir, recordingId + '.warc');
    }
}