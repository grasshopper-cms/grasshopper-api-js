'use strict';

var _ = require('lodash'),
    BB = require('bluebird'),
    grasshopper = require('grasshopper-core'),
    Purest = require('purest'),
    facebook = new Purest({ provider:'facebook', promise: true });

// Facebook social linking/registration module
module.exports = function(app){
    app.get('/connect/facebook/done', facebookReq);
};

// Middleware that handles all of the logic for creating and linking social accounts.
function facebookReq(req, res){
    var redirectUrl = _.has(grasshopper.config.identities, 'facebook') ? grasshopper.config.identities.facebook.redirectUrl : 'defaultRoute';

    BB.bind({token: req.cookies['gh-token'], params: req.query, res: res, user: null })
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
            console.log(err.stack);
            res.redirect(redirectUrl + '?error='+ err.message);
        });
}

// Function that will create a user in our system. the `auth` function will auto-create
// a user if there is not already one in the system.
function _createSocialAccount(){
    var res = this.res;

    return grasshopper.auth('Facebook', { code: this.params.access_token })
                .then(function(token) {
                    res.cookie('gh-token', new Buffer(token).toString('base64'));
                });
}

// Function will link an existing account loading the current user from their token.
// We first load the user from token, then link identities. If there is an issue, we try to
// create the user.
function _linkSocialAccount(){
    return BB.bind(this)
            .then(_loadUserFromToken)
            .then(_getUserDetailsFromFacebook)
            .then(_linkIdentity)
            .catch(function(){
                return _createSocialAccount.call(this); // Could not link account. Create one instead.
            });
}

// Utility function to return the current logged in user.
function _loadUserFromToken(){
    return grasshopper.request(this.token).users.current()
            .then(function(user){
                this.user = user;
            }.bind(this));
}

// Utility function to link a user's facebook info to the current user.
function _linkIdentity() {
    var identityOptions = {
            id: this.socialUserInfo.id,
            accessToken: this.params.access_token,
            expires: this.params.raw.expires
        };

    return grasshopper.request(this.token).users.linkIdentity(this.user._id.toString(), 'facebook', identityOptions);
}

// Function will obtian the user's social information from facebook and return it
// as user info to our promise chain. This info can later be used to look up our
// users a either create an account or log them in
function _getUserDetailsFromFacebook() {
    return facebook.query()
                .get('/me?access_token=' + this.params.access_token)
                .request()
                .then(function(res) {
                    this.socialUserInfo = res[1];
                }.bind(this));
}
