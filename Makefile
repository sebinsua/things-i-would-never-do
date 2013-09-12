REPORTER = list

test:
	@NODE_ENV=test ./node_modules/.bin/mocha test/server --reporter list &&\
	@NODE_ENV=test ./node_modules/.bin/karma start --basePath test/client --single-run --browsers Chrome

watch-your-back:
	@NODE_ENV=test ./node_modules/.bin/mocha test/server --reporter list --growl --watch

watch-your-front:
	@NODE_ENV=test ./node_modules/.bin/karma start --basePath test/client --browsers Chrome

.PHONY: test watch-your-back
