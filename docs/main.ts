import {createSyntaxDiagramsCode} from 'chevrotain'
import {JassParser} from "../jass/parser";
import {toAstVisitor} from "../jass/visitor";

const parser = new JassParser()

const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

const run = async () => {
    const request = await fetch('test.txt');
    const response = await request.text();

    let astFromVisitor = toAstVisitor(response);
    //console.log(astFromVisitor);
    console.log(JSON.stringify(astFromVisitor, null, "\t"));
}
run().then();

