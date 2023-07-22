const names = {
    jass: '',
    root: '',
    type_declare: '',
    globals_declare: '',
    linebreak_declare: '',
    variable_declare: '',
    native_declare: '',
    function_declare: '',
    function_locals: '',
    function_returns: '',
    function_args: '',
    function_call: '',
    return_statement: '',
    if_statement: '',
    else_statement: '',
    elseif_statement: '',
    addition: '',
    arrayaccess: '',
    call_statement: '',
    exitwhen_statement: '',
    expression: '',
    typedname: '',
    loop_statement: '',
    multiplication: '',
    primary: '',
    set_statement: '',
    statement: '',
    end: '',
}

for (const key of Object.keys(names)) {
    names[key] = key;
}

export default names;