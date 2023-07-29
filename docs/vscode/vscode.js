_document = {
    positionAt(offset) {
        return {
            line: 0
        }
    }
}

function require(name) {
    switch (name) {
        case 'vscode':
            return {
                env: {},
                SemanticTokensBuilder: function () {

                }
            }
    }
}


