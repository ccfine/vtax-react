/**
 * author       : liuliyuan
 * createTime   : 2017/12/5 11:54
 * description  :
 */
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
//const rewireCssModules = require('react-app-rewire-css-modules');
/**
 * !!!!
 * 出现Cannot read property 'exclude' of undefined时需要去
 * react-app-rewire-less 中8 - 14行修改为
 * const fileLoader = getLoader(
 config.module.rules,
 rule =>
 rule.loader &&
 typeof rule.loader === 'string' &&
 (rule.loader.indexOf(`${path.sep}file-loader${path.sep}`) !== -1 ||
 rule.loader.indexOf(`@file-loader${path.sep}`) !== -1)
 );
 * */


module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
   // config = rewireCssModules(config, env);
    config = rewireLess.withLoaderOptions({
        modifyVars: { "@primary-color": "#1890ff" },
    })(config, env);
    return config;
};