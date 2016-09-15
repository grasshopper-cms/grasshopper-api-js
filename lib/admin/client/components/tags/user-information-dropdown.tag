user-information-dropdown
    .user-information-section(name='userInformationSection' onclick='{ toggleUserInformationDropdown }' class='{ active : userInformationDropdownIsOpen }')
        img.gravatar-img(src='{ user.gravatarUrl }')
        i.fa.fa-caret-down.expand-icon
        .user-information-dropdown
            .logged-in-as-text Logged in as { user.displayName }
            a.profile(href='{ base }user/{ user._id }') Profile
            a.logout(href='{ base }logout') Log Out
        .close-dropdown-overlay(show='{ userInformationDropdownIsOpen }')
    script.
        var crypto = require('crypto');

        this.user = this.opts.appState('user');
        this.userInformationDropdownIsOpen = false;
        
        this.base = this.opts.appState('configs.base');

        this.opts.appState.subscribe('user', function(user) {
            this.user = user;
            this.user.gravatarUrl = gravatarUrl(this.user.email, 24);
            this.update();
        }.bind(this));
        
        this.toggleUserInformationDropdown = function() {
            if(this.userInformationDropdownIsOpen) {
                this.closeUserInformationDropdown();
            } else {
                this.openUserInformationDropdown();
            }
            return true;
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