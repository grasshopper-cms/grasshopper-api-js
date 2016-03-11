'use strict';

var _ = require('lodash'),
    BB = require('bluebird'),
    grasshopper = require('grasshopper-core'),
    Purest = require('purest'),
    identitySetup = (!_.isUndefined(grasshopper.config.identities.pinterest)),
    pinterest = new Purest({
        provider:'pinterest',
        promise: true,
        key: (identitySetup) ? grasshopper.config.identities.pinterest.key : '',
        secret: (identitySetup) ? grasshopper.config.identities.pinterest.secret : '',
        config: {
            "pinterest": {
                "https://api.pinterest.com": {
                    "__domain": {
                        "auth": {
                            "auth": {
                                "bearer": "[0]"
                            }
                        }
                    },
                    "[version]/{endpoint}": {
                        "__path": {
                            "alias": "__default",
                            "version": "v1"
                        }
                    }
                }
            }
        }
    });

/**
 * The pinterest api module for linking and creating pinterest accounts.
 */
module.exports = function(app){
    app.get('/connect/pinterest/done', pinterestReq);
};

// Middleware that handles all of the logic for creating and linking social accounts.
function pinterestReq(req, res){
    var redirectUrl = _.has(grasshopper.config.identities, 'pinterest') ? grasshopper.config.identities.pinterest.redirectUrl : 'defaultRoute';

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
            res.redirect(redirectUrl + '?error='+ err.message);
        });
}

// Function that will create a user in our system. the `auth` function will auto-create
// a user if there is not already one in the system.
function _createSocialAccount(){
    var res = this.res;

    return grasshopper.auth('Pinterest', this.params)
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
            .then(_getUserSocialDetails)
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

// Pinterest doesn't return any user info back with login. So go get some basic info so we can link the account.
function _getUserSocialDetails(){
    return pinterest
                .query()
                .get('me/?fields=id,first_name,last_name,url,username,image&access_token=' + this.params.access_token)
                .request()
                .then(function(res){
                    this.socialUserInfo = res[1].data;
                }.bind(this));
}

// Utility function to link a user's pinterest info to the current user.
function _linkIdentity() {
    var identityOptions = {
            id: this.socialUserInfo.id,
            accessToken: this.params.access_token,
            screen_name: this.socialUserInfo.username
        };

    return grasshopper.request(this.token).users.linkIdentity(this.user._id.toString(), 'pinterest', identityOptions);
}
