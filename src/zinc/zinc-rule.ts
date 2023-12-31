const enum ZincRule {
    // generic
    identifier_name = 'identifier_name',
    identifier_type = 'identifier_type',
    identifier_returns = 'identifier_returns',
    // rules
    zinc = 'zinc',
    library = 'library',
    requires = 'requires',
    optional = 'optional',
    library_constant = 'library_constant',
    library_declare = 'library_declare',
    library_requires = 'library_requires',
    library_root = 'library_root',
    access_scope = 'access_scope',
    variable_declare = 'variable_declare',
    variable_set = 'variable_set',
    function_declare = 'function_declare',
    function_arg = 'function_arg',
    function_call = 'function_call',
    return_statement = 'return_statement',
    if_statement = 'if_statement',
    else_statement = 'else_statement',
    while_statement = 'while_statement',
    addition = 'addition',
    arrayaccess = 'arrayaccess',
    expression = 'expression',
    for_statement = 'for_statement',
    multiplication = 'multiplication',
    primary = 'primary',
    primary_div = 'primary_div',
    set_statement = 'set_statement',
    statement = 'statement',
    // tokens
    whitespace = 'whitespace',
    comment = 'comment',
    comment_multiline = 'comment_multiline',
    // keyword
    and = 'and',
    break = 'break',
    constant = 'constant',
    false = 'false',
    public = 'public',
    private = 'private',
    debug = 'debug',
    else = 'else',
    endfunction = 'endfunction',
    endglobals = 'endglobals',
    extends = 'extends',
    function = 'function',
    globals = 'globals',
    if = 'if',
    for = 'for',
    not = 'not',
    null = 'null',
    or = 'or',
    returns = 'returns',
    return = 'return',
    type = 'type',
    true = 'true',
    while = 'while',
    // someone
    comma = 'comma',
    equals = 'equals',
    assign = 'assign',
    notequals = 'notequals',
    lessorequal = 'lessorequal',
    less = 'less',
    greatorequal = 'greatorequal',
    great = 'great',
    add = 'add',
    add_assign = 'add_assign',
    sub = 'sub',
    sub_assign = 'sub_assign',
    mult = 'mult',
    mult_assign = 'mult_assign',
    div = 'div',
    div_assign = 'div_assign',
    semicolon = 'semicolon',
    lparen = 'lparen',
    rparen = 'rparen',
    lcurlyparen = 'lcurlyparen',
    rcurlyparen = 'rcurlyparen',
    lsquareparen = 'lsquareparen',
    rsquareparen = 'rsquareparen',
    real = 'real',
    integer = 'integer',
    rawcode = 'rawcode',
    stringliteral = 'stringliteral',
    identifier = 'identifier',
}

export default ZincRule
