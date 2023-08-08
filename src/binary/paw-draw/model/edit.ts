/** Define the type of edits used in paw draw files. */
export default interface PawDrawEdit {
    readonly color: string;
    readonly stroke: ReadonlyArray<[number, number]>;
}
