import {TextDocument, workspace} from 'vscode'

// https://code.visualstudio.com/api/references/contribution-points#Configuration-property-schema
export default class ExtSettings {
    constructor(document: TextDocument) {
        const c = workspace.getConfiguration('', document.uri)
        this.allowMultiline = c.get<boolean>('AllowMultiline') ?? false
    }

    allowMultiline: boolean
}
