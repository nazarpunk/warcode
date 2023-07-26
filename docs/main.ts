import {createSyntaxDiagramsCode, Lexer} from 'chevrotain';
import JassParser from "../src/jass/jass-parser";
import {JassVisitor} from "../src/jass/jass-visitor";
import JassRule from "../src/jass/jass-rule";
import JassTokensList from "../src/jass/jass-tokens-list";

const parser = new JassParser();

const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

(async () => {
    const visitor = new JassVisitor();
    const request = await fetch('test.txt');
    const text = await request.text();
    const lexer = new Lexer(JassTokensList, {
        //ensureOptimizations: true,
        recoveryEnabled: true,
    });
    const result = lexer.tokenize(text);
    //console.log('tokens', result.tokens);
    //console.log('tokens', result.errors);
    parser.input = result.tokens;

    const nodes = parser[JassRule.jass]();


    visitor.visit(nodes);
    for (const error of parser.errors) {
        console.log(error.name);
        console.log(error.token);
        console.warn('error', error);
    }
})();
