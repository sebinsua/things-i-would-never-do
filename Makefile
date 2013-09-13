REPORTER = list

test:
	NODE_ENV=test ./node_modules/.bin/mocha test/server/**/ --reporter list && NODE_ENV=test ./node_modules/.bin/karma start --single-run

watch-your-back:
	NODE_ENV=test ./node_modules/.bin/mocha test/server/**/ --reporter list --growl --watch

watch-your-front:
	NODE_ENV=test ./node_modules/.bin/karma start

.PHONY: test watch-your-back watch-your-front
