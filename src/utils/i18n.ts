import i18next from 'i18next'
import {env} from 'vscode'

export const enum i18n {
    // lexer
    lexerError = 'lexerError',
    unexpectedCharacter = 'unexpectedCharacter',
    unableToPopLexerMode = 'unableToPopLexerMode',
    // parser
    parserError = 'parserError',
    mismatchToken = 'mismatchToken',
    notAllInputParsed = 'notAllInputParsed',
    noViableAlt = 'noViableAlt',
    earlyExit = 'earlyExit',
    // validator
    stringIndexRedeclareError = 'stringIndexRedeclareError',
    multilineStringError = 'multilineStringError',
    localRedeclareArgError = 'localRedeclareArgError',
    localRedeclareLocalError = 'localRedeclareLocalError',
    constantInFunctionError = 'constantInFunctionError',
    misssingLocalKeywordError = 'misssingLocalKeywordError',
    sameNameArgumentError = 'sameNameArgumentError',
    arrayInitializeError = 'arrayInitializeError',
}

const en: Record<i18n, string> = {
    // lexer
    [i18n.lexerError]: 'Lexer:',
    [i18n.unexpectedCharacter]: `$t(${i18n.lexerError}) Unexpected character.`,
    [i18n.unableToPopLexerMode]: `$t(${i18n.lexerError}) Unable to pop lexer mode.`,
    // parser
    [i18n.parserError]: 'Parser:',
    [i18n.mismatchToken]: `$t(${i18n.lexerError}) Mismatch tokens.`,
    [i18n.notAllInputParsed]: `$t(${i18n.lexerError}) Not all input parsed.`,
    [i18n.noViableAlt]: `$t(${i18n.lexerError}) No viable alt.`,
    [i18n.earlyExit]: `$t(${i18n.lexerError}) Early Exit.`,
    // validator
    [i18n.stringIndexRedeclareError]: 'String with index {{index}} redeclared.',
    [i18n.multilineStringError]: 'Avoid multiline strings. Use `|n` or `\\n` to linebreak.',
    [i18n.localRedeclareArgError]: 'Local variable `{{name}}` redeclare argument.',
    [i18n.localRedeclareLocalError]: 'Local variable `{{name}}` redeclared.',
    [i18n.constantInFunctionError]: 'Constant not allowed in function.',
    [i18n.misssingLocalKeywordError]: 'Missing local keyword.',
    [i18n.sameNameArgumentError]: 'Arguments with same name `{{name}}`.',
    [i18n.arrayInitializeError]: 'Array varriables can\'t be initialised.',
}

const ru: Record<i18n, string> = {
    // lexer
    [i18n.lexerError]: 'Лексер:',
    [i18n.unexpectedCharacter]: `$t(${i18n.lexerError}) Неожиданный символ.`,
    [i18n.unableToPopLexerMode]: `$t(${i18n.lexerError}) Невозможно убрать режим лексера.`,
    // parser
    [i18n.parserError]: 'Парсер:',
    [i18n.mismatchToken]: `$t(${i18n.parserError}) Несоответствующий токен.`,
    [i18n.notAllInputParsed]: `$t(${i18n.parserError}) Парсинг завершён не полностью.`,
    [i18n.noViableAlt]: `$t(${i18n.parserError}) Альтернативный вариант не найден.`,
    [i18n.earlyExit]: `$t(${i18n.parserError}) Преждевременное завершение.`,
    // validator
    [i18n.stringIndexRedeclareError]: 'Строка с индексом {{index}} переопределена.',
    [i18n.multilineStringError]: 'Избегайте многострочных строк. Используйте `|n` или `\\n` для переноса строки.',
    [i18n.localRedeclareArgError]: 'Локальная переменная `{{name}}` переопределяет аргумент.',
    [i18n.localRedeclareLocalError]: 'Локальная переменная `{{name}}` объявлена повторно.',
    [i18n.constantInFunctionError]: 'Обявление констант в функции запрещено.',
    [i18n.misssingLocalKeywordError]: 'Не достаёт ключевого слова `local`.',
    [i18n.sameNameArgumentError]: 'Аргументы с одинаковым именем `{{name}}`.',
    [i18n.arrayInitializeError]: 'Массивы нельзя инициализировать.',
}

i18next.init({
    lng: env.language,
    //debug: true,
    fallbackLng: 'en',
    resources: {
        en: {translation: en},
        ru: {translation: ru}
    }
}).then()
