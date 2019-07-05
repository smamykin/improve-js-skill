import {getElementFromHtmlString} from "./tools";

function ContextMenu(element) {
    this._el = element;
}


ContextMenu.prototype.setPosition = function (x, y) {
    if (!this._el) {
        return this;
    }
    this._el.style.top = y + 'px';
    this._el.style.left = x + 'px';

    return this
};


/**
 * @returns {ContextMenu}
 */
ContextMenu.prototype.addCloseEvents = function (events, target) {
    if (!Array.isArray(events)) {
        throw 'InvalidArgument';
    }

    let onClose = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this._el.remove();
        events.forEach((eventName) => target.removeEventListener(eventName, onClose));
    };

    events.forEach((eventName) => target.addEventListener(eventName, onClose, false));

    return this;
};

ContextMenu.prototype.on = function (type, callback, isCapture) {
    this._el.addEventListener(type, callback, !!isCapture);
    return this;
};

ContextMenu.prototype.show = function (container) {
    container = container || document.getElementsByTagName('body')[0];
    container.appendChild(this._el);
    return this;
};
ContextMenu.prototype.remove = function () {
    this._el.remove();
    this._el = undefined;

    return null;
};

function ContextMenuFactory() {
}

ContextMenuFactory.create = function () {
    const html = require('./../templates/contextMenu.twig')(),
        element = getElementFromHtmlString(html);

    ContextMenuFactory.instance && ContextMenuFactory.instance.remove();
    ContextMenuFactory.instance = new ContextMenu(element);

    return ContextMenuFactory.instance
};

export default ContextMenuFactory;
