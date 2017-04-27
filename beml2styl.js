"use strict";

Array.prototype.unique = function() {
    var arr = this.concat();
    for(var i=0; i<arr.length; ++i) {
        for(var j=i+1; j<arr.length; ++j) {
            if(arr[i] === arr[j])
                arr.splice(j--, 1);
        }
    }

    return arr;
};

let buildStyl = require('./buildStyl');

module.exports = ($, bemlConfig) => {

    let blocks    = $('[block]');
    let elements  = $('[elem]');
    let currentId = 0;
    let blockId   = 0;
    let bemlObj = {};

    if(!blocks.length) {
        console.log('No blocks found');
        return "// noblocks";
    }

    blocks.each( (i, block) => {

        let name = $(block).attr('block');
        let mods = $(block).attr('mod');

        if( !$(block).attr('block_id') ) {

            currentId = blockId;

            $(`[block~=${name}]`).attr('block_id', blockId);

            if( !bemlObj[blockId] ) {
                bemlObj[blockId] = {
                    blockId   : blockId,
                    blockName : name,
                    mods      : [],
                    elems     : {}
                };
            }

            blockId++;

        }

        if (bemlObj[currentId] && mods) {
            bemlObj[currentId]['mods'] = bemlObj[currentId]['mods'].concat(mods.split(',')).unique();
        }

    });

    elements.each( (i, elem) => {
        
        let elemName = $(elem).attr('elem');
        let mods     = $(elem).attr('mod');
        let id       = null;


        if (!$(elem).attr('block_id')) {
            id = $(elem).closest('[block]').attr('block_id');
            $(elem).attr('block_id', id);
        }
        
        if (!bemlObj[id].elems[elemName]) {
            bemlObj[id].elems[elemName] = {
                elemName : elemName,
                mods     : [] 
            }
        }

        if (mods) {
            bemlObj[id].elems[elemName]['mods'] = bemlObj[id].elems[elemName]['mods'].concat(mods.split(',')).unique()
        }

    });

    return buildStyl(bemlObj, bemlConfig);

};