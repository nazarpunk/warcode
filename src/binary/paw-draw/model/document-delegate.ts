export default interface PawDrawDocumentDelegate {
    getFileData(): Promise<Uint8Array>;
}
