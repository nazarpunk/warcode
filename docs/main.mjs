import {createSyntaxDiagramsCode} from 'chevrotain'
import {JassParser} from "../src/jass/jass-parser.ts";
import {JassVisitor} from "../src/jass/jass-visitor.mjs";

const parser = new JassParser(true)
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);


(async () => {
    const visitor = new JassVisitor();
    const request = await fetch('test.txt');
    parser.inputText = await request.text();

    const result = visitor.visit(parser.jass());

    for (const error of parser.errorlist) console.warn(error)

    //console.log(result);
})();