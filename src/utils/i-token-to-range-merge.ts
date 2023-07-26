// noinspection NpmUsedModulesInstalled
import {Position, Range} from "vscode";
import {IToken} from "@chevrotain/types";

export default (a: IToken, b: IToken) => new Range(
    new Position(a.startLine! - 1, a.startColumn! - 1),
    new Position(b.endLine! - 1, b.endColumn!),
);
