module.exports = {
  ci: {
    collect: {
      "url": [
        "http://localhost/index.html",
        "http://localhost/documentation/images/",
      ],
      staticDistDir: './_site',
      staticDirFileDiscoveryDepth: 1,
      "numberOfRuns": 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
    preset: 'lighthouse:recommended',
    },
  },
};
