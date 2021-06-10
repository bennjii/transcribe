//@ts-nocheck

const stringToJSON = (raw_content) => {
    if(!raw_content || !process.browser) return null;
    // Create DOM Object

    const parsed = new DOMParser().parseFromString(raw_content, 'text/html');
    const json = toJSON(parsed);

    return json;
}

const toJSON = (node: Document) => {
    node = node || this;

    let obj = { nodeType: node.nodeType };

    if (node.tagName) {
        obj.tagName = node.tagName.toLowerCase();
    } else
    if (node.nodeName) {
        obj.nodeName = node.nodeName;
    }
    if (node.nodeValue) {
        obj.nodeValue = node.nodeValue;
    }

    let attrs = node.attributes;
    let childNodes = node.childNodes;
    let length;
    let arr;

    if(attrs) {
        length = attrs.length;
        arr = obj.attributes = new Array(length);
        for (let i = 0; i < length; i++) {
            const attr = attrs[i];
            arr[i] = [attr.nodeName, attr.nodeValue];
        }
    }

    if(childNodes) {
        length = childNodes.length;
        arr = obj.childNodes = new Array(length);
        for (let i = 0; i < length; i++) {
            arr[i] = toJSON(childNodes[i]);
        }
    }

    return obj;
}

const JSONtoString = (json_content) => {
    if(!json_content || !process.browser) return null;
    if(json_content == undefined || json_content == null) return null;

    // Create DOM Object
    const parsed = toDOM(json_content.childNodes[0].childNodes[1]);

    const serializer = new XMLSerializer();
    let re_string = serializer.serializeToString(parsed);

    re_string = re_string.replace('</body>', '<body>');
    re_string = re_string.replace(/<body("[^"]*?"|'[^']*?'|[^'">])*>/g, '')

    return re_string;
}

const toDOM = (obj) => {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }
    let node, nodeType = obj.nodeType;
    switch (nodeType) {
        case 1: //ELEMENT_NODE
            node = document.createElement(obj.tagName);
            let attributes = obj.attributes || [];
            for (let i = 0, len = attributes.length; i < len; i++) {
                const attr = attributes[i];
                node.setAttribute(attr[0], attr[1]);
            }
            break;
        case 3: //TEXT_NODE
            // eslint-disable-next-line no-undef
            node = document.createTextNode(obj.nodeValue);
            break;
        case 8: //COMMENT_NODE
            node = document.createComment(obj.nodeValue);
            break;
        case 9: //DOCUMENT_NODE
            node = document.implementation.createDocument();
            break;
        case 10: //DOCUMENT_TYPE_NODE
            node = document.implementation.createDocumentType(obj.nodeName);
            break;
        case 11: //DOCUMENT_FRAGMENT_NODE
            node = document.createDocumentFragment();
            break;
        default:
            return node;
    }
    if (nodeType == 1 || nodeType == 11) {
        const childNodes = obj.childNodes || [];
        for (let i = 0,  len = childNodes.length; i < len; i++) {
            node.appendChild(toDOM(childNodes[i]));
        }
    }
    return node;
}

const snakeToCammel = (name: string) => {
    name = name.replace(/"/g, "");
    name = name.trim();

    if(name !== "")
        return name.replace(/(\-\w)/g, function(m) {
            return m[1].toUpperCase()
        });
    else return null;
}


export { stringToJSON, JSONtoString }