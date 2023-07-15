const rule = {
    jass: '',
    terminator: '',
    rootstatement: '',
    typedecl: '',
    nativedecl: '',
    funcarg: '',
    funcarglist: '',
    funcreturntype: '',
    linebreakdecl: '',
}
for (const k of Object.keys(rule)) {
    rule[k] = k;
}

export default Object.freeze(rule);