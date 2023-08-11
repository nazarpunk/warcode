import { createSyntaxDiagramsCode, Lexer } from 'chevrotain';
import JassTokensList from '../src/jass/jass-tokens-list';
import JassParser from '../src/jass/jass-parser';
import JassVisitorDocs from '../src/jass/jass-visitor-docs';
const parser = new JassParser({
    recoveryEnabled: true,
    nodeLocationTracking: 'onlyOffset',
    skipValidations: false,
});
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
    const nodes = parser["jass" /* JassRule.jass */]();
    for (const error of parser.errors)
        console.error(error);
    const visitor = new JassVisitorDocs();
    visitor.visit(nodes);
})();
//# sourceMappingURL=main.js.map