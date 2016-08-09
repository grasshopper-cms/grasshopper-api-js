top-bar
    //- #top-nav
    //-     ul.pull-right
    //-         li
    //-             a(data-rv-href='model:userModel->href', href='/user/{ model._id }')
    //-                 img.gravatar-img(src='{ this.model.gravatarUrl }')
    //-                 span Logged in as
    //-                 span &nbsp; { model.displayname }
    //-         li
    //-             a#logOutButton(href='/logout')
    //-                 | Log Out
    script.
        var self = this,
            crypto = require('crypto');

        this.opts.appState.subscribe('user', function(user) {
            self.model = user;
            self.model.gravatarUrl = gravatarUrl(self.model.email, 24);
            self.update();
        });

        function gravatarUrl (email, args) {
            var md5value = email ? crypto.createHash('md5').update(email.toLowerCase()).digest("hex") : '';
            return 'http://www.gravatar.com/avatar/' + md5value + '?s=' + args + '&d=mm';
        }

