tabs-bar
    a.brand(href='/items')
    .nav-items
        a.nav-item(each='{ item in menuItems }' href='{ item.href }' class='{ active : item.active, is-spacer : item.isSpacer }')
            i(class='{ item.iconClasses }')
            span { item.name }
        .user-information-section(name='userInformationSection' onclick='{ toggleUserInformationDropdown }' class='{ active : userInformationDropdownIsOpen }')
            img.gravatar-img(src='{ user.gravatarUrl }')
            i.fa.fa-caret-down.expand-icon
            .user-information-dropdown
                .logged-in-as-text Logged in as { user.displayName }
                a.profile(href='/admin/user/{ user._id }') Profile
                a.logout(href='/admin/logout') Log Out
    script.
        var crypto = require('crypto'),
            listenOnce = require('listen-once');

        this.menuItems = markActiveItem(this.opts.appState('configs.menuItems'));
        this.user = this.opts.appState('user');
        this.userInformationDropdownIsOpen = false;

        this.opts.appState.subscribe('user', function(user) {
            this.user = user;
            this.user.gravatarUrl = gravatarUrl(this.user.email, 24);
            this.update();
        }.bind(this));

        this.opts.appState.subscribe('configs.menuItems', function (menuItems) {
            this.menuItems = markActiveItem(menuItems);
            this.update();
        }.bind(this));

        this.toggleUserInformationDropdown = function() {
            if(this.userInformationDropdownIsOpen) {
                this.closeUserInformationDropdown();
            } else {
                this.openUserInformationDropdown();
                listenOnce(document.body, 'click', this.closeUserInformationDropdown.bind(this), true);
            }
        };

        this.openUserInformationDropdown = function() {
            this.userInformationDropdownIsOpen = true;
            this.update();
        };

        this.closeUserInformationDropdown = function() {
            this.userInformationDropdownIsOpen = false;
            this.update();
        };

        function gravatarUrl(email, args) {
            var md5value = email ? crypto.createHash('md5').update(email.toLowerCase()).digest("hex") : '';
            return 'http://www.gravatar.com/avatar/' + md5value + '?s=' + args + '&d=mm';
        }

        function markActiveItem(menuItems) {
            return menuItems.map(function(item) {
                if (item.href === window.location.pathname) {
                    item.active = true;
                }
                return item;
            });
        }
