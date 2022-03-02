export default {
    mongoUrl: global.__MONGO_URI__ || process.env.MONGO_URI,
    port: process.env.PORT || 3000
}