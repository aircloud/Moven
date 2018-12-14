export function getDomPath(e) {
    let el = e.target;
    let stack = [];
    while ( el.parentNode != null ) {
        let sibCount = 0;
        let sibIndex = 0;
        for ( let i = 0; i < el.parentNode.childNodes.length; i++ ) {
            let sib = el.parentNode.childNodes[i];
            if ( sib.nodeName === el.nodeName ) {
                if ( sib === el ) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if ( el.hasAttribute('id') && el.id !== '' ) {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if ( sibCount > 1 ) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        el = el.parentNode;
    }
    return stack.slice(1).join('>'); // removes the html element
}

export function getAttr(obj, attr) {
    if(!obj || typeof obj !== 'object' || !attr || typeof attr !== 'string') return null;
    try {
        let attrs = attr.split('.');
        let subObj = obj;
        for(let subAttr of attrs) {
            subObj = subObj[subAttr];
        }
        return subObj;
    } catch (e) {
        return null;
    }
}