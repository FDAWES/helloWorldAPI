var env = {};

env.staging = {
  httpPort: process.env.PORT || 3000,
  envName: "staging"
};

env.production = {
  httpPort: process.env.PORT || 5000,
  envName: "production"
}

var currentEnvironment = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : env.staging.envName;

module.exports = env[currentEnvironment] || env.staging;