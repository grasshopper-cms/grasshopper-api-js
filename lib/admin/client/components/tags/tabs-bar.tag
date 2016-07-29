tabs-bar
    .container
        .large-12.columns
            a.brand(href='/items') Grasshopper
            a.btn-navbar(data-toggle='collapse', data-target='.nav-collapse')
                i.fa.fa-align-justify
            .nav-collapse
                .row
                    ul#main-nav.nav.pull-right(onclick='toggle')
                        li.nav-item(each="{ item in menuItems }")
                            a#content.nav-item-link(onclick="{ focus }" href="{ item.href }", data-bypass='true', class="{ active : item.active }")
                                i(class="{ item.iconClasses }")
                                span { item.name }
    script.

        this.toggle = function toggle() {
            console.log('toggle dropdown');
        }
        // Initialize
        self.menuItems = markActiveItem(this.opts.appState('configs.menuItems'));

        // Listen
        this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
            self.menuItems = markActiveItem(menuItems);
            self.update();
        });

        function markActiveItem(menuItems) {
            return menuItems.map(function (item) {
                if (item.href === window.location.pathname) {
                    item.active = true;
                }
                return item;
            });
        }