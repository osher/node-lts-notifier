require('colors');

module.exports = ({
  assign    = Object.assign,
  process   = global.process,
  conf      = loadConf({
    process
  }),
  formatter = require('./formatter'),
  mx        = require('./mx'),
}) => {
    valid(conf);
    if (conf.customFormatter) assign(formatter, customFormatter(conf));
    if (null == conf.reported) delete conf.reported;
    return assign(conf, {formatter, mx: mx(conf.nodemailer)});
};

function valid(conf) {
    //TBD: config validation - throws
    return true
}

function customFormatter(conf) {
    const modName = conf.customFormatter.module || conf.customFormatter;
    const isAbsolute =
         modName.startsWith('/')     //absolute linux
         || modName.includes(':\\'); //absolute windows
    const modPath = isAbsolute ? modName : `${process.cwd()}/${modName}`;
    const mod = require(modPath);
    return mod.init
      ? mod.init(conf.customFormatter)
      : mod
}

function loadConf({
  process: {
    env: {
      LTS_NOTIF_CONF: srcStr,
      LTS_NOTIF_FILE,
      LTS_NOTIF_HOME,
      HOME,
      HOMEPATH,
    }
  },
  srcDir    = LTS_NOTIF_HOME || HOME || HOMEPATH,
  srcFile   = LTS_NOTIF_FILE || `${srcDir}/.lts-notif.yaml`,
  fs        = require('fs'),
  yaml      = require('js-yaml'),
}) {
    let src = 'env var: LTS_NOTIF_CONF';
    if (!srcStr) {
        try {
            src = `from file: ${srcFile.green}`;
            srcStr = fs.readFileSync(srcFile)
        } catch (e) {
            console.error([
              '\n',
              'ERROR:'.bgRed, ' Cannot open configuration file'.bold,'\n',
              'tried path: '.bold,'\n',
              `  ${srcFile}`.green,'\n',
              '\n',
              'effecting env-vars:'.bold,'\n',
              ' - ', 'LTS_NOTIF_FILE'.cyan, ' - path to the yaml file\n',
              ' - ', 'LTS_NOTIF_HOME'.cyan, ' - when ', 'LTS_NOTIF_FILE'.cyan, ' is unset, may indicate location of ', '.lts-notif.yaml'.green,'\n',
                ' - ', 'HOME/HOMEPATH'.cyan, '  - when ', 'LTS_NOTIF_HOME'.cyan, ' is unset, ', '.lts-notif.yaml'.green, ' is searched in user\'s home directory\n',
              '\n',
              'error:'.bold, '\n',
              `  ${e.message}`.yellow, '\n',
            ].join(''));
            return process.exit(1);
        }
    }

    try {
        return Object.assign(yaml.load(srcStr), {srcFile})
    } catch(e) {
        console.error([
          '\n',
          'ERROR:'.bgRed, ' Failed to parse configuration'.red, '\n',
          'source:'.bold, '\n',
          `  ${src}`, '\n',
          '\n',
          'error:'.bold, '\n',
              `  ${e.message}`.yellow
        ].join(''));
        return process.exit(1);
    }
}
