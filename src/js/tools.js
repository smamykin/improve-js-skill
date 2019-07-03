export function sleep() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

export function randomBool() {
    return Math.random() < 0.5;
}

export function getElementFromHtmlString(html) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = html.trim();

    return wrapper.firstChild;
}
