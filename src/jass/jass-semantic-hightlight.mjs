import {SemanticTokensBuilder} from "vscode";
import {JassTokenMap} from "../../jass/lexer.mjs";
import {TokenLegend} from "../token-legend.mjs";
import ParseRuleName from "../../jass/parse-rule-name.mjs";

export default class JassSemanticHightlight {

    constructor() {
        this.#builder = new SemanticTokensBuilder();
    }

    get builder() {
        return this.#builder;
    }

    /** @type {SemanticTokensBuilder} */ #builder;

    build() {
        return this.#builder.build();
    }

    /**
     * @param {import('chevrotain').IToken} location
     * @param  {import('vscode').TokenLegend} type
     */
    #mark = (location, type) => {
        if (this.builder === null) return;
        if (location === undefined) return;
        this.builder?.push(
            location.startLine - 1,
            location.startColumn - 1,
            location.endColumn - location.startColumn + 1,
            type
        );
    }

    /** @param {import('chevrotain').IToken} token */
    [JassTokenMap.linecomment.name](token) {
        this.#mark(token, TokenLegend.jass_linecomment);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.typedecl](ctx) {
        this.#mark(ctx[JassTokenMap.type.name]?.[0], TokenLegend.jass_type_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], TokenLegend.jass_extends_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[1], TokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.linecomment.name]?.[0], TokenLegend.jass_typedef_comment);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.nativedecl](ctx) {
        this.#mark(ctx[JassTokenMap.constant.name]?.[0], TokenLegend.jass_constant_keyword);
        this.#mark(ctx[JassTokenMap.native.name]?.[0], TokenLegend.jass_native_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.funcdecl](ctx) {
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
    }

    /** @param {import('chevrotain').IToken[]} tokens */
    [ParseRuleName.funcarg](tokens) {
        this.#mark(tokens[0], TokenLegend.jass_type);
        this.#mark(tokens[1], TokenLegend.jass_argument);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.funcarglist](ctx) {
        if (ctx[JassTokenMap.comma.name]) for (const comma of ctx[JassTokenMap.comma.name]) {
            this.#mark(comma, TokenLegend.jass_comma);
        }
        this.#mark(ctx?.[JassTokenMap.nothing.name]?.[0], TokenLegend.jass_type);
    }

    /** @param {import('chevrotain').IToken} token */
    [ParseRuleName.funcreturntype](token) {
        this.#mark(token, TokenLegend.jass_type);
    }

}