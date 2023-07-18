import {JassTokenMap} from "../../jass/lexer.mjs";
import {TokenLegend} from "../token-legend.mjs";
import ParseRuleName from "../../jass/parse-rule-name.mjs";
// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, SemanticTokensBuilder} from "vscode";
import ITokenToRange from "../utils/i-token-to-range.mjs";

export default class JassSemanticHightlight {

    constructor() {
        this.#builder = new SemanticTokensBuilder();
        this.diagnostics = [];
    }

    get builder() {
        return this.#builder;
    }

    /** @type {import('vscode').Diagnostic[]} */ diagnostics;
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

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.commentdecl](ctx) {
        this.#mark(ctx[JassTokenMap.comment.name]?.[0], TokenLegend.jass_comment);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.typedecl](ctx) {
        this.#mark(ctx[JassTokenMap.type.name]?.[0], TokenLegend.jass_type_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], TokenLegend.jass_extends_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[1], TokenLegend.jass_type);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.nativedecl](ctx) {
        this.#mark(ctx[JassTokenMap.constant.name]?.[0], TokenLegend.jass_constant_keyword);
        this.#mark(ctx[JassTokenMap.native.name]?.[0], TokenLegend.jass_native_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function_native);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.funcdecl](ctx) {
        //console.log('funcdecl', ctx[ParseRuleName.localgroup]);

        this.#mark(ctx[JassTokenMap.function.name]?.[0], TokenLegend.jass_function_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
        this.#mark(ctx[JassTokenMap.endfunction.name]?.[0], TokenLegend.jass_endfunction_keyword);
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

        // check same argument name
        const args = ctx?.[ParseRuleName.funcarg];
        if (args) {
            /** @type {Object.<string,import('chevrotain').IToken[]>}*/
            const obj = {};

            for (const arg of args) {
                const list = arg?.children?.[JassTokenMap.identifier.name];
                if (!list || list.length !== 2) continue;
                const [type, name] = list;
                if (type.isInsertedInRecovery || name.isInsertedInRecovery) continue;
                (obj[name.image] ??= []).push(name);
            }

            for (const v of Object.values(obj)) {
                if (v.length < 2) continue;
                for (const t of v)
                    this.diagnostics.push({
                        message: `Arguments with same name: ${t.image}`,
                        range: ITokenToRange(t),
                        severity: DiagnosticSeverity.Warning,
                    });
            }
        }

        // mark
        this.#mark(ctx?.[JassTokenMap.nothing.name]?.[0], TokenLegend.jass_type);
    }

    /** @param {import('chevrotain').IToken} token */
    [ParseRuleName.funcreturntype](token) {
        this.#mark(token, TokenLegend.jass_type);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.localgroup](ctx) {
        //this.#mark(ctx?.[JassTokenMap.nothing.name]?.[0], TokenLegend.jass_type);
    }

}