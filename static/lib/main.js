(function () {

    function cleanPath(path) {
        // topic
        path = path.replace(
            /^\/topic\/(\d+)\/[^/?#]+(\/.*)?$/,
            '/topic/$1$2'
        );
        // category
        path = path.replace(
            /^\/category\/(\d+)\/[^/?#]+(\/.*)?$/,
            '/category/$1$2'
        );
        return path;
    }

    function updateAddressBar() {
        const current = window.location.pathname;
        const cleaned = cleanPath(current);

        if (current !== cleaned) {
            history.replaceState(
                {},
                '',
                cleaned + window.location.search + window.location.hash
            );
        }
    }

    function updateLinks() {
        $('a[href]').each(function () {
            const href = $(this).attr('href');

            if (
                !href ||
                href.startsWith('http') ||
                href.startsWith('//') ||
                href.startsWith('#') ||
                href.startsWith('javascript:')
            ) {
                return;
            }

            const cleaned = cleanPath(href);

            if (cleaned !== href) {
                $(this).attr('href', cleaned);
            }
        });
    }

    function updateCanonical() {
        const cleaned =
            window.location.origin +
            cleanPath(window.location.pathname);

        let canonical =
            document.querySelector('link[rel="canonical"]');

        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }

        canonical.href = cleaned;
    }

    function run() {
        updateAddressBar();
        updateLinks();
        updateCanonical();
    }

    $(window).on('action:ajaxify.end', run);
    $(document).ready(run);

})();