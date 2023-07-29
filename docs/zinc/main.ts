// noinspection DuplicatedCode

import {createSyntaxDiagramsCode, Lexer} from 'chevrotain';
import ZincParser from "../../src/zinc/zinc-parser";
import ZincTokensList from "../../src/zinc/zinc-tokens-list";
import ZincRule from "../../src/zinc/zinc-rule";
import {ZincVisitor} from "../../src/zinc/zinc-visitor";

const parser = new ZincParser();

const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

(async () => {
    const request = await fetch('test.txt');
    const text = await request.text();

    const lexer = new Lexer(ZincTokensList, {
        recoveryEnabled: true,
        positionTracking: 'onlyOffset',
        deferDefinitionErrorsHandling: true,
        ensureOptimizations: true,
    });
    const result = lexer.tokenize(text);

    parser.input = result.tokens;
    const nodes = parser[ZincRule.zinc]();

    const visitor = new ZincVisitor();
    // @ts-ignore
    //visitor.bridge = new VscodeBridge(_document, [], []);

    visitor.visit(nodes);
})();
