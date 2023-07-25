const enum code {
    tab = 9, // Tab
    lf = 10, // Line Feed
    vt = 11, // Vertical Tab
    ff = 12, // Form Feed
    cr = 13, // Carriage Return
    space = 32, // Space
}

export default (charCode: number) =>
    charCode === code.space
    ||
    charCode === code.tab
    ||
    charCode === code.cr
    ||
    charCode === code.lf
    ||
    charCode === code.ff
    ||
    charCode === code.vt;
