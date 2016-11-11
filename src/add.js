/**
 * Created by genffy on 2016/11/4.
 */
"use strict";
var _ = require('lodash')
var utils = require('./utils')
var path = require('path')
var fs = require('fs')

var webPathMap = {
    'action': {
        'fileNameType': 'normal',
        'path': 'actions',
        'extension': 'es6'
    },
    'entry': {
        'fileNameType': 'normal',
        'path': 'entries',
        'extension': 'jsx'
    },
    'html': {
        'fileNameType': 'normal',
        'path': 'html',
        'extension': 'html'
    },
    'mock': {
        'fileNameType': 'normal',
        'path': 'html/mocks',
        'extension': 'json'
    },
    'reducer': {
        'fileNameType': 'normal',
        'path': 'reducers',
        'extension': 'es6'
    },
    'web': {
        'fileNameType': 'upper',
        'path': 'containers/web',
        'extension': 'jsx'
    },
    'style': {
        'fileNameType': 'normal',
        'path': 'less',
        'extension': 'less'
    }
};
const componentPathWeb = {

};

function addWeb(conf){
    var basePath = process.cwd() + '/src';
    // check web is exist?
    _.forEach(webPathMap, function(value, key){
        var template = utils.getTemplate(key, value);
        var complied = _.template(template);
        // create file path
        if(key == 'mock'){
            value.path += '/'+conf.camelName;
        }
        var filepath = path.join( basePath, value.path, `${value.fileNameType == 'normal' ? conf.name : conf[value.fileNameType+'Name']}.${value.extension}`);
        // 在 reduces index.es6 中添加
        // export  {<>} from "./question-list.es6";
        if(key == 'reducer'){
            var ex = `\r\nexport  {${conf.camelName}} from "./${conf.name}.es6";`,
                exPath = path.join(process.cwd() + '/src', value.path, 'index.es6');
            fs.appendFile(exPath, ex, function (err) {
                if(err){
                    utils.writeFile(filepath, ex);
                }
            });
        }
        utils.writeFile(filepath, complied(conf))
    });


    // TODO 在 src 下的 index.jsx 中添加相应的注册
}

function addComponent(){
    
}
function Add(program){
    var args = program.args,
        opts = program.args,
        cwd = process.cwd(),
        templateType = args[1],
        moduleType = args[2],
        name = args[3],
        upperCaseName  = name.split('-').map((item)=>{return _.upperFirst(item)}).join(''),
        camelName = _.camelCase(name);

    var writeConf = {
        name: name,
        upperName: upperCaseName,
        camelName: camelName
    };

    switch (moduleType){
        case 'web':
            addWeb(writeConf);
            break;
        default:
            break;
    }
}
module.exports = Add;