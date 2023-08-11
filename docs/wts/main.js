import { createSyntaxDiagramsCode } from 'chevrotain';
//import WtsRule from '../../src/wts/wts-rule'
import WtsParser from '../../src/wts/wts-parser';
//import WtsVisitor from '../../src/wts/wts-visitor'
const parser = new WtsParser();
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
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