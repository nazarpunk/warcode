import {createSyntaxDiagramsCode} from 'chevrotain'
import {JassParser} from "../src/jass/jass-parser";
import {JassVisitor} from "../src/jass/jass-visitor";
import JassRule from "../src/jass/jass-rule";

const parser = new JassParser(true)
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);


(async () => {
    const visitor = new JassVisitor();
    const request = await fetch('test.txt');
    parser.inputText = await request.text();

    visitor.visit(parser[JassRule.jass]());

    for (const error of parser.errorlist) console.warn(error)
})();