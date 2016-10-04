tabs-bar
    .top-menu-container
        .collapsed-menu-toggle(onclick='{ toggleCollapseMenu }')
            .bars(class='{ active : isShowingCollapseMenu }')
    a.brand(name='brandElement' href='/items' onclick='{ goToThisElementsHref }')
    user-information-dropdown(app-state='{ opts.appState }')
    .nav-items(name='navItemsElement' class='{ open : isShowingCollapseMenu }')
        virtual(each='{ menuItem, index in menuItems }')
            .nav-item.no-sub-items(name='navItem' if='{ menuItem.fields.active && !menuItem.childTabs.length }' class='{ active : menuItem.active }' onclick='{ goToThisElementsHref }')
                i.left-icon(class='{ menuItem.fields.iconclasses }')
                span { menuItem.fields.title }
                i.right-icon(class='{ menuItem.fields.iconclasses }')
            .nav-item.has-sub-items(name='navItem' if='{ menuItem.fields.active && menuItem.childTabs.length }' class='{ active : menuItem.active, expanded : menuItem.expanded }' onclick='{ toggleThisTabsDropdown }')
                i.left-icon(class='{ menuItem.fields.iconclasses }')
                span { menuItem.fields.title }
                i.fa.fa-caret-down.expand-icon
                i.right-icon(class='{ menuItem.fields.iconclasses }')
            .nav-item-dropdown(if='{ menuItem.fields.active && menuItem.childTabs.length }' class='{ navItemDropdownClasses(menuItem) }')
                .nav-item(name='navItem' each='{ childTab in menuItem.childTabs }' if='{ childTab.fields.active }' class='{ active : childTab.active }' onclick='{ goToThisElementsHref }')
                    i.left-icon(class='{ childTab.fields.iconclasses }')
                    span { childTab.fields.title }
                    i.right-icon(class='{ menuItem.fields.iconclasses }')

    script.
        var throttle = require('lodash/throttle');

        this.location = this.opts.location;
        this.routeMatchesPath = this.opts.routeMatchesPath;

        this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
            this.menuItems = this.markActiveItems(menuItems);
            this.update();
        }.bind(this));

        this.toggleThisTabsDropdown = function(event) {
            if(event.item.menuItem.expanded) {
                event.item.menuItem.expanded = false;
            } else {
                event.item.menuItem.expanded = true;
            }
            return true; // RIOT will prevent default by default.
        };

        this.toggleCollapseMenu = function() {
            if(this.isShowingCollapseMenu) {
                this.isShowingCollapseMenu = false;
            } else {
                this.isShowingCollapseMenu = true;
            }
        };

        this.navItemDropdownClasses = function(menuItem) {
            var classes = [];

            if(menuItem.active) {
                classes.push('active');
            }

            if(menuItem.expanded) {
                classes.push('expanded');
            }

            classes.push('height-'+ menuItem.childTabs.length);

            return classes.join(' ');
        };

        this.goToThisElementsHref = function(event) {
            this.location.goTo(event.item.menuItem.fields.href);
        };

        this.markActiveItems = function(menuItems) {
            var _routeMatchesPath = this.routeMatchesPath,
                currentPath = this.location.getCurrentLocation();

            return menuItems.map(function(menuItem) {
                var foundThisOne,
                    foundChild;

                menuItem.childTabs && menuItem.childTabs.forEach(function(menuItem) {
                    found = menuItem.fields.activeWhenRouteMatches.find(function(route) {
                        return _routeMatchesPath(route, currentPath.pathname)
                    });

                    if(found) {
                        menuItem.active = true;
                        foundChild = true;
                    }
                });

                found = menuItem.fields.activeWhenRouteMatches.find(function(route) {
                    return _routeMatchesPath(route, currentPath.pathname)
                });

                if(found) {
                    menuItem.active = true;
                }

                if(foundChild) {
                    menuItem.active = true;
                    menuItem.expanded = true;
                }

                return menuItem;
            });
        }