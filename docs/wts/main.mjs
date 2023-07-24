import {WtsParser} from "../../src/wts/wts-parser.mjs";
import {createSyntaxDiagramsCode} from "chevrotain";
import {WtsVisitor} from "../../src/wts/wts-visitor.mjs";
import WtsParserRuleName from "../../src/wts/wts-parser-rule-name.mjs";

const parser = new WtsParser()
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

(async () => {
    const visitor = new WtsVisitor();
    const request = await fetch('test.txt');
    parser.inputText = await request.text();

    const result = visitor.visit(parser[WtsParserRuleName.wts]());

    for (const error of parser.errorlist) console.warn(error)

    //console.log(result);
})();
