// Global test setup for Jest
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Chrome API
global.chrome = {
  runtime: {
    getURL: jest.fn((path) => `chrome-extension://test-id/${path}`),
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    lastError: null,
  },
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        const result = {};
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((data, callback) => {
        if (callback) callback();
        return Promise.resolve();
      }),
      onChanged: {
        addListener: jest.fn(),
      },
    },
  },
  tabs: {
    query: jest.fn((query, callback) => {
      const tab = { id: 1, url: 'https://example.com' };
      if (callback) callback([tab]);
      return Promise.resolve([tab]);
    }),
    sendMessage: jest.fn(),
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
    setTitle: jest.fn(),
  },
  contextMenus: {
    create: jest.fn(),
    removeAll: jest.fn(),
    onClicked: {
      addListener: jest.fn(),
    },
  },
};

// Mock crypto API for secure token generation
global.crypto = {
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
};

// Mock fetch API
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
