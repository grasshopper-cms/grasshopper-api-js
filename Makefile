test:
	@./node_modules/.bin/mocha --reporter spec --timeout 10000

.PHONY: test