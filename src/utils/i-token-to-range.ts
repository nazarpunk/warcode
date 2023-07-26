// noinspection NpmUsedModulesInstalled
import {Position, Range} from "vscode";
import {IToken} from "@chevrotain/types";

export default (token:IToken) => new Range(
    new Position(token.startLine! - 1, token.startColumn! - 1),
    new Position(token.endLine! - 1, token.endColumn!),
);
