'use strict';

var _ = require('lodash'),
    BB = require('bluebird'),
    grasshopper = require('grasshopper-core');

/**
 * The google api module is responsible for all google operations.
 */
module.exports = function(app){
    app.get('/connect/instagram/done', instagram);
};

// Middleware that handles all of the logic for creating and linking social accounts.
function instagram(req, res){
    var redirectUrl = _.has(grasshopper.config.identities, 'instagram') ? grasshopper.config.identities.instagram.redirectUrl : 'defaultRoute';

    BB.bind({token: req.session.token, params: req.query, res: res, req: req, user: null })
        .then(function(){
            if(!_.isUndefined(this.token)){
                this.token = new Buffer(this.token, 'base64'); //A token exists, let's decode it

                return _linkSocialAccount.call(this);
            }
            else {
                return _createSocialAccount.call(this);
            }
        })
        .then(function(){
            res.redirect(redirectUrl);
        })
        .catch(function(err){
            res.redirect(redirectUrl + '?error='+ err.message);
        });
}

// Function that will create a user in our system. the `auth` function will auto-create
// a user if there is not already one in the system.
function _createSocialAccount(){
    return BB
        .bind(this)
        .then(function() {
            return grasshopper.auth('Instagram', this.params);
        })
        .then(function(token) {
            this.req.session.token = new Buffer(token).toString('base64');
            this.req.session.save();
        });
}

// Function will link an existing account loading the current user from their token.
// We first load the user from token, then link identities. If there is an issue, we try to
// create the user.
function _linkSocialAccount(){
    return BB.bind(this)
            .then(_loadUserFromToken)
            .then(_linkIdentity)
            .catch(function(){
                return _createSocialAccount.call(this); // Could not link account. Create one instead.
            });
}

// Utility function to return the current logged in user.
function _loadUserFromToken(){
    return BB
        .bind(this)
        .then(function() {
            return grasshopper.request(this.token).users.current();
        })
        .then(function(user){
            this.user = user;
        });
}

// Utility function to link a user's instagram info to the current user.
function _linkIdentity() {
    var identityOptions = {
            id: this.params.raw.user.id,
            accessToken: this.params.access_token,
            screen_name: this.params.raw.user.username
        };

    return BB.resolve(grasshopper.request(this.token).users.linkIdentity(this.user._id.toString(), 'instagram', identityOptions));
}
