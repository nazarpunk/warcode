import {createSyntaxDiagramsCode, Lexer} from 'chevrotain';
import JassParser from "../src/jass/jass-parser";
import {JassVisitor} from "../src/jass/jass-visitor";
import JassRule from "../src/jass/jass-rule";
import JassTokensList from "../src/jass/jass-tokens-list";
import VscodeBridge from "../src/utils/vscode-bridge";

const parser = new JassParser();

const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

(async () => {
    const request = await fetch('test.txt');
    const text = await request.text();

    const lexer = new Lexer(JassTokensList, {
        recoveryEnabled: true,
        positionTracking: 'onlyOffset',
        deferDefinitionErrorsHandling: true,
        ensureOptimizations: true,
    });
    const result = lexer.tokenize(text);

    parser.input = result.tokens;
    const nodes = parser[JassRule.jass]();

    const visitor = new JassVisitor();
    // @ts-ignore
    //visitor.bridge = new VscodeBridge(_document, [], []);

    visitor.visit(nodes);
})();
