test:
	./node_modules/.bin/mocha test/server --reporter list &&\
	./node_modules/.bin/karma start --basePath test/client --single-run --browsers Chrome

.PHONY: test
