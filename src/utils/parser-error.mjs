export default class {
    /**
     * @param {import('./parser-error-type.mjs').default} type
     * @param {import('chevrotain').IToken} token
     */
    constructor(type, token) {
        this.type = type;
        this.token = token;
    }
}
