var fs, path, register, Compiler, ExternalCompiler, compiler, exports, flatten, CommonJSCompiler, CommonJSDefineCompiler, AMDCompiler, PyYamlCompiler, __ref, __i, __len;
fs = require('fs');
path = require('path');
compiler = (__ref = require('connect-compiler'), register = __ref.register, Compiler = __ref.Compiler, ExternalCompiler = __ref.ExternalCompiler, __ref);
module.exports = exports = compiler;
flatten = function(it){
  return it.reduce(function(a, b){
    return [].concat(a, b);
  });
};
exports.CommonJSCompiler = CommonJSCompiler = (function(superclass){
  CommonJSCompiler.displayName = 'CommonJSCompiler';
  var prototype = __extend(CommonJSCompiler, superclass).prototype, constructor = CommonJSCompiler;
  prototype.CJS_HEADER = "require.install('{ID}', function(require, exports, module){\n\n";
  prototype.CJS_FOOTER = "\n\n});\n";
  prototype.PAT_FULL_EXT = /\..*$/;
  prototype.PAT_JS_EXT = /(\.min)?\.mod(\.min)?\.js([?#].*)?$/i;
  prototype.id = 'commonjs';
  prototype.match = /((?:\.min)?)\.mod((?:\.min)?)\.js$/i;
  prototype.ext = flatten(['.js', '.co', '.coffee', '.jison'].map(function(it){
    return ['$1$2' + it, it];
  }));
  prototype.ext2wraps = {
    co: 'coco',
    coffee: 'coffee',
    jison: 'jison'
  };
  prototype.drop_full_ext = true;
  prototype.drop_pat = null;
  prototype.drop_path_parts = 0;
  function CommonJSCompiler(){
    superclass.apply(this, arguments);
  }
  prototype.matches = function(srcDir, pathname){
    var src, ext;
    src = path.join(srcDir, pathname);
    if (this.match.exec(pathname)) {
      return (function(){
        var __i, __ref, __len, __results = [];
        for (__i = 0, __len = (__ref = this.ext).length; __i < __len; ++__i) {
          ext = __ref[__i];
          __results.push(src.replace(this.match, ext));
        }
        return __results;
      }.call(this));
    }
  };
  prototype.compileSync = function(data){
    var nfo, drop_parts, drop_full, drop_pat, mod_parts, mod_id, header, footer, __ref;
    nfo = this.info;
    drop_parts = (__ref = nfo.drop_path_parts) != null
      ? __ref
      : this.drop_path_parts;
    drop_full = (__ref = nfo.drop_full_ext) != null
      ? __ref
      : this.drop_full_ext;
    drop_pat = nfo.drop_pat || this.drop_pat || (drop_full
      ? this.PAT_FULL_EXT
      : this.PAT_JS_EXT);
    mod_parts = nfo.url.slice(1).replace(drop_pat, '').split('/').slice(drop_parts);
    if (mod_parts[mod_parts.length - 1] === 'index') {
      mod_parts.pop();
    }
    mod_id = path.normalize(mod_parts.join('/'));
    header = this.CJS_HEADER.replace('{ID}', mod_id);
    footer = this.CJS_FOOTER.replace('{ID}', mod_id);
    return header + data + footer;
  };
  prototype.doCompile = function(text, wrapped, cb){
    var ext;
    ext = /\.([^\.]+)$/.exec(this.info.src)[1];
    this.wraps = this.ext2wraps[ext];
    return superclass.prototype.doCompile.apply(this, arguments);
  };
  return CommonJSCompiler;
}(Compiler));
/**
 * @class As CommonJSCompiler, but uses browserify's `require.define()` rather 
 *  than the included `require.install()`.
 */
exports.CommonJSDefineCompiler = CommonJSDefineCompiler = (function(superclass){
  CommonJSDefineCompiler.displayName = 'CommonJSDefineCompiler';
  var prototype = __extend(CommonJSDefineCompiler, superclass).prototype, constructor = CommonJSDefineCompiler;
  prototype.CJS_HEADER = "require.define('/node_modules/{ID}.js', function(require, module, exports, __dirname, __filename){\n\n";
  prototype.id = 'commonjs_define';
  function CommonJSDefineCompiler(){
    superclass.apply(this, arguments);
  }
  return CommonJSDefineCompiler;
}(CommonJSCompiler));
/**
 * @class As CommonJSCompiler, but creates the module to comply with AMD's `define()`.
 */
exports.AMDCompiler = AMDCompiler = (function(superclass){
  AMDCompiler.displayName = 'AMDCompiler';
  var prototype = __extend(AMDCompiler, superclass).prototype, constructor = AMDCompiler;
  prototype.CJS_HEADER = "define('{ID}', function(require, module, exports){\n\n";
  prototype.CJS_FOOTER = "\n\nreturn module.exports;\n});\n";
  prototype.PAT_JS_EXT = /(\.min)?\.amd(\.min)?\.js([?#].*)?$/i;
  prototype.id = 'amd';
  prototype.match = /((?:\.min)?)\.amd((?:\.min)?)\.js$/i;
  function AMDCompiler(){
    superclass.apply(this, arguments);
  }
  return AMDCompiler;
}(CommonJSCompiler));
exports.PyYamlCompiler = PyYamlCompiler = (function(superclass){
  PyYamlCompiler.displayName = 'PyYamlCompiler';
  var YAML_TO_JSON, prototype = __extend(PyYamlCompiler, superclass).prototype, constructor = PyYamlCompiler;
  prototype.id = 'pyyaml';
  prototype.match = /\.json$/i;
  prototype.ext = '.yaml';
  YAML_TO_JSON = "try:\n    import lessly.data.yaml_omap\nexcept ImportError:\n    pass\nimport sys, yaml, json\njson.dump(yaml.load(sys.stdin), sys.stdout)";
  prototype.YAML_TO_JSON = YAML_TO_JSON;
  prototype.cmd = "python -c '" + YAML_TO_JSON + "'";
  function PyYamlCompiler(){
    superclass.apply(this, arguments);
  }
  return PyYamlCompiler;
}(ExternalCompiler));
for (__i = 0, __len = (__ref = [CommonJSCompiler, CommonJSDefineCompiler, AMDCompiler, PyYamlCompiler]).length; __i < __len; ++__i) {
  compiler = __ref[__i];
  register(compiler);
}
function __extend(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
