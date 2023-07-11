import json from "./json.mjs";

//lexer: JsonLexer,

const text = `
function MyFunc 

endfunction

`;

const parser = json.parser;
const lexResult = json.lexer.tokenize(text)

console.log(lexResult);