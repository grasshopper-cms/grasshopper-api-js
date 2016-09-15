// var throttle = require('lodash/throttle'),
//     Mousetrap = require('mousetrap'),
//     magicFocusFinder = require('magic-focus-finder'),
//     template = require('./template.pug');
//
// module.exports = {
//     start : start
// };
//
// function start(elementToRenderInto) {
//
// }
//
// this.menuItems = markActiveItems(this.opts.appState('configs.menuItems'));
//
// this.mffInstance;
//
// this.on('updated', function() {
//     setTimeout(function() {
//         var currentlyFocused;
//         if(this.mffInstance) {
//             currentlyFocused = this.mffInstance.getCurrent();
//             this.mffInstance.refresh();
//             this.mffInstance.setCurrent(currentlyFocused);
//         }
//     }.bind(this), 300);
// });
//
// this.mouseTrapInstance = Mousetrap.bind('option', function() {
//     this.toggleCollapseMenu();
//     this.update();
//     if(this.isShowingCollapseMenu) {
//         this.initFocusFinder();
//     } else {
//         this.disableFocusFinder();
//     }
// }.bind(this));
//
// this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
//     this.hydrateMenuItemsWithBaseHref(menuItems);
//     this.menuItems = markActiveItems(menuItems);
//     this.update();
// }.bind(this));
//
// this.toggleThisTabsDropdown = function(event) {
//     if(event.item.menuItem.expanded) {
//         event.item.menuItem.expanded = false;
//     } else {
//         event.item.menuItem.expanded = true;
//     }
//     return true; // RIOT will prevent default by default.
// };
//
// this.toggleCollapseMenu = function() {
//     if(this.isShowingCollapseMenu) {
//         this.isShowingCollapseMenu = false;
//     } else {
//         this.isShowingCollapseMenu = true;
//     }
// };
//
// this.hydrateMenuItemsWithBaseHref = function(menuItems) {
//     menuItems.forEach(_fixMenuItemHref);
// };
//
// this.navItemDropdownClasses = function(menuItem) {
//     var classes = [];
//
//     if(menuItem.active) {
//         classes.push('active');
//     }
//
//     if(menuItem.expanded) {
//         classes.push('expanded');
//     }
//
//     classes.push('height-'+ menuItem.childTabs.length);
//
//     return classes.join(' ');
// };
//
// this.initFocusFinder = function() {
//     if(!this.mffInstance) {
//         this.mffInstance = magicFocusFinder
//             .configure({
//                 container : this.root,
//                 useRealFocus : true,
//                 azimuthWeight : 0,
//                 distanceWeight : 2
//             })
//             .start();
//
//         window.mff = this.mffInstance;
//     } else {
//         this.mffInstance.unlock();
//     }
// };
//
// this.disableFocusFinder = function() {
//     this.mffInstance.lock();
//     this.navItem.forEach(function(navItem) {
//         navItem.classList.remove('focused');
//     });
// };
//
// function _fixMenuItemHref(menuItem) {
//     menuItem.childTabs && menuItem.childTabs.forEach(_fixMenuItemHref);
//     return menuItem.fields.href = window.gh.configs.base + menuItem.fields.href;
// }
//
// function markActiveItems(menuItems) {
//     return menuItems.map(function(menuItem) {
//         var foundThisOne,
//             foundChild;
//
//         menuItem.childTabs && menuItem.childTabs.forEach(function(menuItem) {
//             found = menuItem.fields.highlightedWhenRouteMatches.find(function(route) {
//                 return _routeMatchesPath(window.gh.configs.base + route, window.location.pathname)
//             });
//
//             if(found) {
//                 menuItem.active = true;
//                 foundChild = true;
//             }
//         });
//
//         found = menuItem.fields.highlightedWhenRouteMatches.find(function(route) {
//             return _routeMatchesPath(window.gh.configs.base + route, window.location.pathname)
//         });
//
//         if(found) {
//             menuItem.active = true;
//         }
//
//         if(foundChild) {
//             menuItem.active = true;
//             menuItem.expanded = true;
//         }
//
//         return menuItem;
//     });
// }
//
// function _routeMatchesPath(route, path) {
//     // NOTE Will only match Backbone Router Style Routes.
//     // From Backbone Source: http://backbonejs.org/docs/backbone.html#section-195
//     var optionalParam = /\((.*?)\)/g,
//         namedParam    = /(\(\?)?:\w+/g,
//         splatParam    = /\*\w+/g,
//         escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
//         route;
//
//     route = route.replace(escapeRegExp, '\\$&')
//         .replace(optionalParam, '(?:$1)?')
//         .replace(namedParam, function(match, optional) {
//             return optional ? match : '([^/?]+)';
//         })
//         .replace(splatParam, '([^?]*?)');
//
//     return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$').test(path);
// }