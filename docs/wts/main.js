"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
//import WtsRule from '../../src/wts/wts-rule'
const wts_parser_1 = require("../../src/wts/wts-parser");
//import WtsVisitor from '../../src/wts/wts-visitor'
const parser = new wts_parser_1.default();
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI((0, chevrotain_1.createSyntaxDiagramsCode)(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);
/*
(async () => {

    const visitor = new WtsVisitor();
    const request = await fetch('test.txt');
    parser.inputText = await request.text();

    visitor.visit(parser[WtsRule.wts]());

    for (const error of parser.errorlist) console.warn(error);
})();
 */
//# sourceMappingURL=main.js.map