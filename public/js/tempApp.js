'use strict';

var App = function () {
    var self = this;
    self.config = {
        env: "dev"
    };
    self.map = {};
    self.mapCenter = {}
    
    self.init = function(config){
        if (config) {
            self.config = extend(self.config, config);
        }
    };
    
    function extend(defaultConfig, userConfig) {

        for (var k in userConfig) {
            if (userConfig.hasOwnProperty(k)) {
                defaultConfig[k] = userConfig[k];
            }
        }
        return defaultConfig;

    }

}

