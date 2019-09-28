let me = (options) => {
    window.onload = function () {
        let header = options.header,
            bounds,
            wrap,
            intervals = new Set(),
            anchors = {};

        if (!header) return;

        bounds = header.getBoundingClientRect();

        wrap = document.createElement('div');
        header.parentNode.insertBefore(wrap, header);
        wrap.appendChild(header);
        wrap.setAttribute('style', `height: ${bounds.height}px`);

        options.activeClass = options.activeClass || 'is_active';
        options.correction = options.correction || 15;
        if (!options.speed || options.speed < 0){
            options.speed = 10;
        }
        options.speed *= 10;


        window.addEventListener('scroll', function () {
            fixHeader();
            menuScroll();
        }, false);

        fixHeader();
        menuScroll();

        if (options.links){
            for (let i = options.links.length; i--;){
                options.links[i].addEventListener('click', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    clearAllIntervals();

                    let name = options.links[i].getAttribute('href').replace('#', ''),
                        anchor = getAnchor(name),
                        anchorTop = anchor.getBoundingClientRect().top,
                        speed = anchorTop !== 0 && anchorTop / options.speed,
                        isNegative = anchorTop < 0,
                        intervalId = setInterval(function(){
                            window.scrollBy(0,speed);
                            const rect = anchor.getBoundingClientRect();
                            console.log(speed);
                            if ((isNegative && rect.top > 0)
                            || (!isNegative && rect.top < 0)){
                                clearInterval(intervalId);
                                intervals.delete(intervalId);
                            }
                        }, 0.001);
                    speed = Math.abs(speed) < 1 ? isNegative ? -1 : 1 : speed;
                    intervals.add(intervalId);
                })
            }
        }
        function clearAllIntervals(){
            console.log(intervals);
            for (let i of intervals){
                console.log(i);
                clearInterval(i);
                intervals.delete(i);
            }
        }


        function menuScroll() {
            if (!options.links) return;

            for (let i = options.links.length; i--;) {
                if (!options.links[i].getAttribute('href')) continue;
                let name = options.links[i].getAttribute('href').replace('#', ''),
                    anchor = getAnchor(name),
                    bound = anchor.getBoundingClientRect();

                if (bound.top < options.correction) {
                    for (let j = options.links.length; j--;){
                        options.links[j].className = options.links[j].className.replace(new RegExp(` ${options.activeClass}`), '')
                    }

                    options.links[i].className += ` ${options.activeClass}`;
                    break;
                }
            }

        }

        function getAnchor(name) {
            if (anchors.hasOwnProperty(name)) {
                return anchors[name];
            }
            anchors[name] = document.querySelector(`[name="${name}"]`);
            return anchors[name];

        }

        function fixHeader() {

            let bounds = wrap.getBoundingClientRect();
            if (bounds.top < 0 && header.className.indexOf('d_fixed') < 0) {
                header.className += ' d_fixed';
            } else if (bounds.top >= 0 && header.className.indexOf('d_fixed') >= 0) {
                header.className = header.className.replace(/\s?d_fixed/, '');
            }
        }
    };
};

export default me;