loading-overlay
    #loading-overlay(style="{ display }")
        img.loading-overlay-image(src='/admin/themes/img/loading-spinner-horizontal.f091d23f.gif')
    script.
        var self = this,
            block = 'display: block',
            none = 'display: none',
            appState = this.opts.appState;

        // Initialize
        self.display = appState('loading') ? block : none;

        // Listen
        appState.subscribe('loading', function(loading) {
            self.display = loading ? block : none;
            self.update();
        });

