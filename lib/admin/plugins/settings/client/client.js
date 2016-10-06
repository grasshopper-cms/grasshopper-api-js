'use strict';

var rivets = require('rivets'),
    queryString = require('query-string'),
    dragula = require('dragula'),
    addNamedElementsToObject = require('add-named-elements-to-object'),
    cloneDeep = require('lodash/cloneDeep'),
    view = {
        plugins : window.plugins,
        activeSection : 'general',

        tabs : cloneDeep(window.tabs),
        tabsSortHasChanged : false,
        isSavingTabSort : false,
        isAddingTab : false,

        currentlyActiveRoutes : JSON.stringify(window.activeRoutes, null, 4),

        subViews : {
            general : 'general',
            plugins : 'plugins',
            tabs : 'tabs'
        },

        elements : {
            tabsSortContainer : null,
            tabsSortDragulaHandle : null,

            newTabTitle : null,
            newTabHref : null,
            newTabRoleAdmin : null,
            newTabRoleEditor : null,
            newTabRoleReader : null,
            newTabIconClass : null
        },

        handlePluginCheck : handlePluginCheck,
        handleSubSectionClicked : handleSubSectionClicked,
        handleTabToggled : handleTabToggled,

        handleTabsSorted : handleTabsSorted,
        saveSortedTabs : saveSortedTabs,

        addNewTabFromTabForm : addNewTabFromTabForm,
        cancelTabAddClearForm : cancelTabAddClearForm,

        dragulaInstance : null
    };

init();

function init() {
    view.activeSection = queryString.parse(window.location.hash).tab || view.activeSection;

    bindView();

    addNamedElementsToObject(view.elements, document.querySelector('#settings'));

    console.log(view.currentlyActiveRoutes);

    initDragula();

    console.log('OIROIUROIUROIUROIUROIUROIUROIUROIUROIUROIUROIUROIRU');
}

function bindView() {
    rivets.formatters.equals = function(comparator, comparatee) {
        return comparator === comparatee;
    };

    rivets.formatters.and = function(thing, andThing) {
        return thing && andThing;
    };

    rivets.formatters.or = function(thing, orThing) {
        return thing || orThing;
    };

    rivets.formatters.hasLength = function(thing) {
        return thing && thing.length > 0;
    };

    rivets.bind(document.querySelector('#settings'), { view : view });
}

function initDragula() {
    if(view.dragulaInstance) {
        view.dragulaInstance.destroy();
    }

    view.dragulaInstance = dragula([].slice.apply(view.elements.tabsSortContainer.querySelectorAll('.nested')));

    view.dragulaInstance.on('drop', view.handleTabsSorted);
}

function handleSubSectionClicked(event) {
    window.location.hash = queryString.stringify({ tab : event.currentTarget.getAttribute('section-name') });
    view.activeSection = event.currentTarget.getAttribute('section-name');
}

function handlePluginCheck(event, context) {
    context.plugin.workingType = context.plugin.active ? 'Activating' : 'Deactivating'; // Reversed because rivets has allready set the value;
    context.plugin.isWorking = true;

    window.gh.api.plugins[context.plugin.active ? 'activate' : 'deactivate'](context.plugin.id)
        .then(function(activationPayload) {
            console.log(activationPayload);
            context.plugin.isWorking = false;

            return window.gh.api.tabs.list();
        })
        .then(function(menuTabs) {
            window.gh.appState.set('configs.menuItems', menuTabs);
            view.tabs = menuTabs;
            initDragula();
        })
        .catch(function() {
            context.plugin.isWorking = false;
            context.plugin.active = !context.plugin.active;

            window.gh.alert('Plugin Activation Failed. ');
        });
}

function handleTabToggled(event, context) {
    var tabKey = event.currentTarget.getAttribute('tab-key');

    context[tabKey].workingType = context[tabKey].fields.active ? 'Activating' : 'Deactivating'; // Reversed because rivets has allready set the value;
    context[tabKey].isWorking = true;

    window.gh.api.tab[context[tabKey].fields.active ? 'activate' : 'deactivate'](context[tabKey]._id)
        .then(function() {
            context[tabKey].isWorking = false;
            return window.gh.api.tabs.list();
        })
        .then(function(menuTabs) {
            window.gh.appState.set('configs.menuItems', menuTabs);
        })
        .catch(function() {
            context[tabKey].fields.active = !context[tabKey].fields.active;
        });

    event.preventDefault();
    event.stopPropagation();
}

function handleTabsSorted(el, target) {
    if(target.classList.contains('top-level-parent')) {
        el.classList.remove('parent');
        el.classList.remove('child');
        el.classList.add('parent');
    } else {
        el.classList.remove('parent');
        el.classList.remove('child');
        el.classList.add('child');
    }

    view.tabsSortHasChanged = true;
}

function saveSortedTabs() {
    var collectedIds = [].map.call(view.elements.tabsSortContainer.querySelectorAll('.parent'), function(parentTabElement) {
            return {
                _id : parentTabElement.getAttribute('tab-id'),
                childTabs : [].map.call(parentTabElement.querySelectorAll('.child'), function(childTabElement) {
                    return {
                        _id : childTabElement.getAttribute('tab-id')
                    };
                })
            };
        });

    view.isSavingTabSort = true;

    window.gh.api.tabs.updateSort(collectedIds)
        .then(window.gh.api.tabs.list)
        .then(function(updatedTabs) {
            window.gh.appState.set('configs.menuItems', updatedTabs);
            view.isSavingTabSort = false;
            view.tabsSortHasChanged = false;
        });
}

function addNewTabFromTabForm() {
    var newTab = {
        title : view.elements.newTabTitle.value,
        href : view.elements.newTabHref.value,
        roles : [
            view.elements.newTabRoleAdmin.checked ? 'admin' : '',
            view.elements.newTabRoleEditor.checked ? 'editor' : '',
            view.elements.newTabRoleReader.checked ? 'reader' : ''
        ].join(' '),
        iconclasses : view.elements.newTabIconClass.value
    };

    view.isAddingTab = true;

    window.gh.api.tab.create(newTab)
        .then(window.gh.api.tabs.list)
        .then(function(updatedTabs) {
            window.gh.appState.set('configs.menuItems', updatedTabs);
            view.tabs = updatedTabs;
            initDragula();
            view.isAddingTab = false;
        })
        .catch(function() {
            view.isAddingTab = false;
        });
}

function cancelTabAddClearForm() {
    view.elements.newTabTitle.value = '';
    view.elements.newTabHref.value = '';
    view.elements.newTabRoleAdmin.checked = false;
    view.elements.newTabRoleEditor.checked = false;
    view.elements.newTabRoleReader.checked = false;
    view.elements.newTabIconClass.value = 'Choose an option';
}
