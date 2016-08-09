tabs-bar
    .container
        a.brand(href='/items')
        a.mobile-nav-icon
            i.fa.fa-align-justify
        .nav-items
            a.nav-item(each='{ item in menuItems }' href='{ item.href }' data-bypass='true' class='{ active : item.active, is-spacer : item.isSpacer }')
                i(class='{ item.iconClasses }')
                span { item.name }
    style(scoped).
        :scope {
            position: relative;
            height: 60px;
            line-height: 60px;

            background: #1d354d;
            box-shadow: inset 0 1px 0 #28496b;

            color: #fff;
        }
        .container {
            height: 100%;
        }
        .brand {
            display: inline-block;
            height: 60px;
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
            height: 60px;

            width: 75%;
            float: right;
            text-align: right;
        }
        .nav-item {
            display: inline-block;
            vertical-align: bottom;

            font-size: 12px;
            line-height: 25px;
            font-weight: 600;

            text-decoration: none;

            color: #fff;

            background-color: #1f3852;
            background-image: linear-gradient(to bottom, #24415f, #172b3e);
            background-repeat: repeat-x;

            box-shadow: inset 0 1px 0 #325b85;

            padding: 10px 12px;

            border: 1px solid #080f15;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            border-top-left-radius: 3px;
            background-clip: padding-box;

            margin-right: 4px;
        }
        .nav-item.active .nav-item:active {
            color: #333;
            text-shadow: none;
            background: #fff;
            border-bottom: 1px solid #fff;
        }
        .nav-item.is-spacer {
            background-image: none;
            background-color: transparent;
            border: none;
            box-shadow: none;
        }


    script.
        // Initialize
        this.menuItems = markActiveItem(this.opts.appState('configs.menuItems'));

        console.log(this);

        // Listen
        this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
            this.menuItems = markActiveItem(menuItems);
            this.update();
        }.bind(this));

        function markActiveItem(menuItems) {
            return menuItems.map(function (item) {
                if (item.href === window.location.pathname) {
                    item.active = true;
                }
                return item;
            });
        }