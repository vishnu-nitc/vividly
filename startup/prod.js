const helmet = require('helmet');
const compression = require('compression');


module.exports = funnction(app) {
    app.use(helmet());
    app.use(compression());
}