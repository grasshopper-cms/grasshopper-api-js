tabs-bar
    a.brand(name='brandElement' href='/items')
    .top-menu-container
        user-information-dropdown(app-state='{ opts.appState }')
        .collapsed-menu-toggle(onclick='{ toggleCollapseMenu }')
            .bars(class='{ active : isShowingCollapseMenu }')
    .nav-items(name='navItemsElement' class='{ open : isShowingCollapseMenu }')
        virtual(each='{ menuItem, index in menuItems }')
            a.nav-item.no-sub-items(name='navItem' focusable dynamic-position capture-focus='{ index === 0 }' if='{ menuItem.fields.active && !menuItem.childTabs.length }' href='{ menuItem.fields.href }' class='{ active : menuItem.active }')
                i.left-icon(class='{ menuItem.fields.iconclasses }')
                span { menuItem.fields.title }
                i.right-icon(class='{ menuItem.fields.iconclasses }')
            .nav-item.has-sub-items(name='navItem' focusable dynamic-position if='{ menuItem.fields.active && menuItem.childTabs.length }' class='{ active : menuItem.active, expanded : menuItem.expanded }' onclick='{ toggleThisTabsDropdown }')
                i.left-icon(class='{ menuItem.fields.iconclasses }')
                span { menuItem.fields.title }
                i.fa.fa-caret-down.expand-icon
                i.right-icon(class='{ menuItem.fields.iconclasses }')
            .nav-item-dropdown(if='{ menuItem.fields.active && menuItem.childTabs.length }' class='{ navItemDropdownClasses(menuItem) }')
                a.nav-item(name='navItem' focusable='{ menuItem.expanded }' dynamic-position each='{ childTab in menuItem.childTabs }' if='{ childTab.fields.active }' href='{ childTab.fields.href }' class='{ active : childTab.active }')
                    i.left-icon(class='{ childTab.fields.iconclasses }')
                    span { childTab.fields.title }
                    i.right-icon(class='{ menuItem.fields.iconclasses }')

    script.
        var throttle = require('lodash/throttle'),
            Mousetrap = require('mousetrap'),
            magicFocusFinder = require('magic-focus-finder');

        this.menuItems = markActiveItems(this.opts.appState('configs.menuItems'));

        this.mffInstance;

        this.on('updated', function() {
            setTimeout(function() {
                var currentlyFocused;
                if(this.mffInstance) {
                    currentlyFocused = this.mffInstance.getCurrent();
                    this.mffInstance.refresh();
                    this.mffInstance.setCurrent(currentlyFocused);
                }
            }.bind(this), 300);
        });

        this.mouseTrapInstance = Mousetrap.bind('option', function() {
            this.toggleCollapseMenu();
            this.update();
            if(this.isShowingCollapseMenu) {
                this.initFocusFinder();
            } else {
                this.disableFocusFinder();
            }
        }.bind(this));

        this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
            this.hydrateMenuItemsWithBaseHref(menuItems);
            this.menuItems = markActiveItems(menuItems);
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

        this.hydrateMenuItemsWithBaseHref = function(menuItems) {
            menuItems.forEach(_fixMenuItemHref);
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

        this.initFocusFinder = function() {
            if(!this.mffInstance) {
                this.mffInstance = magicFocusFinder
                    .configure({
                        container : this.root,
                        useRealFocus : true,
                        azimuthWeight : 0,
                        distanceWeight : 2
                    })
                    .start();

                window.mff = this.mffInstance;
            } else {
                this.mffInstance.unlock();
            }
        };

        this.disableFocusFinder = function() {
            this.mffInstance.lock();
            this.navItem.forEach(function(navItem) {
                navItem.classList.remove('focused');
            });
        };

        function _fixMenuItemHref(menuItem) {
            menuItem.childTabs && menuItem.childTabs.forEach(_fixMenuItemHref);
            return menuItem.fields.href = window.gh.configs.base + menuItem.fields.href;
        }

        function markActiveItems(menuItems) {
            return menuItems.map(function(menuItem) {
                var foundThisOne,
                    foundChild;

                menuItem.childTabs && menuItem.childTabs.forEach(function(menuItem) {
                    found = menuItem.fields.highlightedWhenRouteMatches.find(function(route) {
                        return _routeMatchesPath(window.gh.configs.base + route, window.location.pathname)
                    });

                    if(found) {
                        menuItem.active = true;
                        foundChild = true;
                    }
                });

                found = menuItem.fields.highlightedWhenRouteMatches.find(function(route) {
                    return _routeMatchesPath(window.gh.configs.base + route, window.location.pathname)
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

        function _routeMatchesPath(route, path) {
            // NOTE Will only match Backbone Router Style Routes.
            // From Backbone Source: http://backbonejs.org/docs/backbone.html#section-195
            var optionalParam = /\((.*?)\)/g,
                namedParam    = /(\(\?)?:\w+/g,
                splatParam    = /\*\w+/g,
                escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
                route;

            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');

            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$').test(path);
        }
