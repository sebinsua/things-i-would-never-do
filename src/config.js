/* jslint node: true */
'use strict';

var config = {
    'development': {
        'REDISCLOUD_URL': process.env.REDISCLOUD_URL ? process.env.REDISCLOUD_URL : '',
        'TWITTER_KEY': process.env.TWITTER_KEY ? process.env.TWITTER_KEY : '',
        'TWITTER_SECRET': process.env.TWITTER_SECRET ? process.env.TWITTER_SECRET : ''
    },
    'test': {
        'REDISCLOUD_URL': process.env.REDISCLOUD_URL ? process.env.REDISCLOUD_URL : '',
        'TWITTER_KEY': process.env.TWITTER_KEY ? process.env.TWITTER_KEY : '',
        'TWITTER_SECRET': process.env.TWITTER_SECRET ? process.env.TWITTER_SECRET : ''
    },
    'production': {
        'REDISCLOUD_URL': process.env.REDISCLOUD_URL,
        'TWITTER_KEY': process.env.TWITTER_KEY,
        'TWITTER_SECRET': process.env.TWITTER_SECRET
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];