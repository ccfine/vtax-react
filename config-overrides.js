/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 11:54
 * description  :
 */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
//const rewireCssModules = require('react-app-rewire-css-modules');

module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
   // config = rewireCssModules(config, env);
    config = rewireLess.withLoaderOptions({
        modifyVars: { "@primary-color": "#1890ff" },
    })(config, env);
    return config;
};