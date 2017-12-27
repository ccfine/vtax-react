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
        modifyVars: {
            "@primary-color": "#1890ff",
            "@font-size-base":'12px',
            "@card-head-padding":"8px",
            "@card-inner-head-padding":"6px",
            "@card-padding-wider":"16px",
            "@card-padding-base": "12px",

            "@layout-header-height":"64px",
            "@layout-header-padding":"0 25px",
            "@layout-footer-padding":"12px 25px",
            "@layout-trigger-height":"24px",
            "@layout-zero-trigger-width":"18px",
            "@layout-zero-trigger-height":"21px",


            //form
            "@form-item-margin-bottom":"0"
        },
    })(config, env);
    return config;
};