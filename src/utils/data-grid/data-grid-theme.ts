import {Theme} from '@glideapps/glide-data-grid/dist/ts/common/styles'

const v = getComputedStyle(document.documentElement)

const GetDataGridTheme = (): Theme => {
    //
    return {
        accentFg: '#ff0000',
        cellHorizontalPadding: 8,
        cellVerticalPadding: 0,
        editorFontSize: '13px',
        fontFamily: v.getPropertyValue('--vscode-font-family'),
        headerIconSize: 0,
        lineHeight: 0,

        accentColor: '#8c96ff',
        accentLight: 'rgba(202, 206, 255, 0.253)',

        textDark: '#ffffff',
        textMedium: '#b8b8b8',
        textLight: '#a0a0a0',
        textBubble: '#ffffff',

        bgIconHeader: '#b8b8b8',
        fgIconHeader: '#000000',
        textHeader: '#a1a1a1',
        textHeaderSelected: '#000000',

        bgCell: '#16161b',
        bgCellMedium: '#202027',

        bgHeader: v.getPropertyValue('--vscode-breadcrumb-background'),
        bgHeaderHasFocus: '#474747',
        bgHeaderHovered: '#404040',

        bgBubble: '#212121',
        bgBubbleSelected: '#000000',

        bgSearchResult: '#423c24',

        borderColor: 'rgba(225,225,225,0.2)',
        drilldownBorder: 'rgba(225,225,225,0.4)',

        linkColor: '#4F5DFF',

        headerFontStyle: '13px',
        baseFontStyle: '13px'
    }
}

export default GetDataGridTheme
