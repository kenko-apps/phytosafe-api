(function (routeConfig) {

  'use strict';

  routeConfig.init = function (app) {

    // *** routes *** //
    const routes = require('../routes/index');
    const routesForm = require('../routes/formulaire');

    // *** register routes *** //
    app.use('/', routes);
    app.use('/api/v1/', routesForm);

  };

})(module.exports);
