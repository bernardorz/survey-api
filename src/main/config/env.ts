export default {
    mongoUrl: global.__MONGO_URI__ || 'mongodb://root:root@localhost:27017/typeorm_db?authSource=typeorm_db&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
    port: process.env.PORT || 3000
}