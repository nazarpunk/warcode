import {createSyntaxDiagramsCode} from 'chevrotain'
import {JassParser} from "../jass/parser.mjs";
import {JassVisitor} from "../jass/visitor.mjs";

const parser = new JassParser()
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

(async () => {
    const visitor = new JassVisitor();
    const request = await fetch('test.txt');
    parser.inputText = await request.text();

    if (parser.errorlist.length > 0) console.log(parser.errorlist);
    console.log(visitor.visit(parser.jass()));
})();