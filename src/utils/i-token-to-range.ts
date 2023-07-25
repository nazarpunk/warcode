// noinspection NpmUsedModulesInstalled
import {Position, Range} from "vscode";

/**
 * @param {import('chevrotain').IToken} token
 * @return {Range}
 */
export default token => new Range(
    new Position(token.startLine - 1, token.startColumn - 1),
    new Position(token.endLine - 1, token.endColumn),
);
