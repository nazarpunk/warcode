import {createSyntaxDiagramsCode} from 'chevrotain'
import {JassParser} from "../jass/parser";
import {JassVisit} from "../jass/visitor";

const parser = new JassParser()
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));

document.body.appendChild(iframe);

(async () => {
    const request = await fetch('test.txt');
    const response = await request.text();
    let astFromVisitor = JassVisit(response);
    console.log(astFromVisitor);
})();