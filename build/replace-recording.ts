import { pathToFileURL } from 'node:url';

import { replaceWarcFile } from '../tests/unit/utils/pollyjs/warc-persister/har2warc';

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    if (process.argv.length !== 4) {
        console.error('USAGE: replace-recording /path/to/new-recording.har /path/to/old-recording.warc');
        process.exit(1);
    }

    const [inputPath, outputPath] = process.argv.slice(2);

    replaceWarcFile(inputPath, outputPath)
        .catch(console.error);
}
