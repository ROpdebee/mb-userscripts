/** Image information. */
export interface ImageInfo {
    /** Dimensions of the image. */
    dimensions: {
        width: number;
        height: number;
    };
    /** Image size in bytes, may be unknown. */
    size?: number;
    /** Textual file type description, may be unknown. */
    fileType?: string;
}
