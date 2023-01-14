require('dotenv').config()

module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false
            }
        }
        return config;
    },
    reactStrictMode: false,
}
