var testsContext = require.context("./src", true, /\.spec.(js|ts)$/);
testsContext.keys().forEach(testsContext);
