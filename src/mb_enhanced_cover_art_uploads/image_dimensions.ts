interface ImageDimensions {
    height: number;
    width: number;
}

// TODO: This originates from mb_caa_dimensions but is also used here. Not sure
// where to put it. It might make sense to put it in the mb_caa_dimensions source
// tree later on, and import it in this source tree where necessary.
export function getImageDimensions(url: string): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
        let done = false;

        function dimensionsLoaded(dimensions: ImageDimensions): void {
            // Make sure we don't poll again, it's not necessary.
            clearInterval(interval);
            if (!done) {  // Prevent resolving twice.
                resolve(dimensions);
                done = true;
                img.src = '';  // Cancel loading the image
            }
        }

        function dimensionsFailed(): void {
            clearInterval(interval);
            if (!done) {
                done = true;
                reject();
            }
        }

        const img = document.createElement('img');
        img.addEventListener('load', () => {
            dimensionsLoaded({
                height: img.naturalHeight,
                width: img.naturalWidth,
            });
        });
        img.addEventListener('error', dimensionsFailed);

        // onload and onerror are asynchronous, so this interval should have
        // already been set before they are called.
        const interval = window.setInterval(() => {
            if (img.naturalHeight) {
                // naturalHeight will be non-zero as soon as enough of the image
                // is loaded to determine its dimensions.
                dimensionsLoaded({
                    height: img.naturalHeight,
                    width: img.naturalWidth,
                });
            }
        }, 50);

        // Start loading the image
        img.src = url;
    });
}
