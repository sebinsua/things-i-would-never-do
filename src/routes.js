var controllers = require('./controllers');

module.exports = function () {
    this.get("/", controllers.index);
    this.get('/partial/:templateName.html', controllers.getPartial);
    this.get('/twitter/search/tweets', controllers.twitterSearchTweets);
};
