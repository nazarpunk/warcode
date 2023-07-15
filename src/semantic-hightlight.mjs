import {SemanticTokensBuilder} from "vscode";
import {JassTokenMap} from "../jass/lexer.mjs";
import {TokenLegend} from "./token-legend.mjs";
import ParseRule from "../jass/parse-rule.mjs";

export default class SemanticHightlight {

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
    [ParseRule.typedecl](ctx) {
        this.#mark(ctx[JassTokenMap.type.name]?.[0], TokenLegend.jass_type_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], TokenLegend.jass_extends_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[1], TokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.linecomment.name]?.[0], TokenLegend.jass_typedef_comment);
    }
}