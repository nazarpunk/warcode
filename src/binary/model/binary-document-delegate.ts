export default interface BinaryDocumentDelegate {
    getFileData(): Promise<Uint8Array>;
}
