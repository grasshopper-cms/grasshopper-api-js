masthead
    .container(style='display: block; opacity: 1;')
        .row
            .small-12.columns.clearfix
                #breadcrumbs.left
                    span(data-rv-breadcrumb='model:breadcrumbs')
                        i.fa.fa-users
                        a(href='/admin') { model.homeString }
                #mastheadButtons.right(riot-tag="masthead-buttons")
    script.
        var self = this;

        this.model = {
            homeString : this.opts.appState('configs.homeString')
        };

        this.opts.appState.subscribe('configs.homeString', function(homeString) {
            self.model.homeString = homeString;
        });
