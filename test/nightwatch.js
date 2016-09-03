module.exports = {
  src_folders: ['test/e2e/__tests__'],
  page_objects_path: ['test/e2e/pages'],
  test_settings: {
    default: {
      launch_url: 'http://ondemand.saucelabs.com:80',
      selenium_port: 80,
      selenium_host: 'ondemand.saucelabs.com',
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      globals: {
        waitForConditionTimeout: 10000,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        build: 'build-' + process.env.CIRCLE_BUILD_NUM,
      },
    },
    local: {
      launch_url: 'http://localhost',
      selenium_port: 4444,
      selenium_host: 'localhost',
    },
    ie: {
      desiredCapabilities: {
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.0',
      },
    },
    latest_edge: {
      desiredCapabilities: {
        browserName: 'microsoftedge',
        platform: 'Windows 10',
      }
    },
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
    latest_chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        platform: 'Windows 10',
      },
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
      },
    },
    latest_firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        platform: 'OSX 10.11',
      },
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        platform: 'OSX 10.11',
      },
    },
  },
};
