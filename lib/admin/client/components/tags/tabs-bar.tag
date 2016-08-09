tabs-bar
    .container
        a.brand(href='/items')
        a.mobile-nav-icon
            i.fa.fa-align-justify
        .nav-items
            a.nav-item(each='{ item in menuItems }' href='{ item.href }' data-bypass='true' class='{ active : item.active }')
                i(class='{ item.iconClasses }')
                span { item.name }
    style(scoped).
        :scope {
            position: relative;
            height: 80px;
            line-height: 80px;

            background: #1d354d;
            box-shadow: inset 0 1px 0 #28496b;

            color: #fff;
        }
        .container {
            height: 100%;
        }
        .brand {
            display: inline-block;
            height: 80px;
            width: 23%;
            background-image: url('images/grasshopper-logo.png');
            background-repeat: no-repeat;
            background-position: left center;
        }
        .mobile-nav-icon {
            display: none;
        }
        .nav-items {
            display: inline-block;
            height: 80px;

            width: 75%;
            float: right;
        }
        .nav-item {
            background-color: purple;
        }


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