'use strict';

module.exports = (bemlObj, bemlConfig) => {

    let styles = "",
        spaces = "    ";

    // формирование блоков
    for (let key in bemlObj) {

        let block         = bemlObj[key],
            elems         = block.elems,
            blockElemsLen = Object.keys(elems).length,
            blockModsLen  = block.mods.length;

        let prevBlock         = bemlObj[+key - 1],
            prevBlockElemsLen = prevBlock ? Object.keys(prevBlock.elems).length : null,
            prevBlockModsLen  = prevBlock ? prevBlock.mods.length : null;

        if (key != 0) {
            styles += `\n`;
            if( (blockElemsLen || blockModsLen) ||
                (prevBlockElemsLen || prevBlockModsLen) ) {
                styles += `\n\n`;
            }
        }

        styles += `.${block.blockName}`;

        if (!blockElemsLen && !blockModsLen) {
            styles += ` {}`;
        }

        let prevElem = null;

        for (let elem in elems) {
            if(prevElem && (prevElem.mods && prevElem.mods.length)) {
                styles += `\n`;
            }

            let elemMods    = elems[elem].mods || null,
                elemModsLen = elemMods.length || null;

            styles += `\n${spaces}&${bemlConfig.elemPrefix}${elems[elem].elemName}`;

            if(elemMods && elemModsLen) {
                for (let i = 0; i < elemModsLen; i++) {
                    styles += `\n${spaces}${spaces}&${bemlConfig.modPrefix}${elemMods[i]} {}`;
                }
            } else {
                styles += ` {}`;
            }

            prevElem = elems[elem];

        }

        if (blockModsLen) {
            if (blockElemsLen) {
                styles += '\n';    
            }
            for (let j = 0; j < blockModsLen; j++) {
                styles += `\n${spaces}&${bemlConfig.modPrefix}${block.mods[j]} {}`;
            }
        }

    }

    return styles;
};