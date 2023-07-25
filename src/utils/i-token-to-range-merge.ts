// noinspection NpmUsedModulesInstalled
import {Position, Range} from "vscode";

/**
 * @param {import('chevrotain').IToken} a
 * @param {import('chevrotain').IToken} b
 * @return {Range}
 */
export default (a, b) => new Range(
    new Position(a.startLine - 1, a.startColumn - 1),
    new Position(b.endLine - 1, b.endColumn),
);
