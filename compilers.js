var fs, path, ref$, register, Compiler, ExternalCompiler, compiler, exports, flatten, CommonJSCompiler, CommonJSDefineCompiler, AMDCompiler, PyYamlCompiler, i$, len$;
fs = require('fs');
path = require('path');
compiler = (ref$ = require('connect-compiler'), register = ref$.register, Compiler = ref$.Compiler, ExternalCompiler = ref$.ExternalCompiler, ref$);
module.exports = exports = compiler;
flatten = function(it){
  return it.reduce(function(a, b){
    return [].concat(a, b);
  });
};
exports.CommonJSCompiler = CommonJSCompiler = (function(superclass){
  CommonJSCompiler.displayName = 'CommonJSCompiler';
  var prototype = extend$(CommonJSCompiler, superclass).prototype, constructor = CommonJSCompiler;
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
  prototype.drop_index = false;
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
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.ext).length; i$ < len$; ++i$) {
          ext = ref$[i$];
          results$.push(src.replace(this.match, ext));
        }
        return results$;
      }.call(this));
    }
  };
  prototype.compileSync = function(data){
    var nfo, ref$, drop_index, drop_parts, drop_full, drop_pat, mod_parts, mod_id, header, footer;
    nfo = this.info;
    drop_index = (ref$ = nfo.drop_index) != null
      ? ref$
      : this.drop_index;
    drop_parts = (ref$ = nfo.drop_path_parts) != null
      ? ref$
      : this.drop_path_parts;
    drop_full = (ref$ = nfo.drop_full_ext) != null
      ? ref$
      : this.drop_full_ext;
    drop_pat = nfo.drop_pat || this.drop_pat || (drop_full
      ? this.PAT_FULL_EXT
      : this.PAT_JS_EXT);
    mod_parts = nfo.url.slice(1).replace(drop_pat, '').split('/').slice(drop_parts);
    if (mod_parts[mod_parts.length - 1] === 'index' && drop_index) {
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
  var prototype = extend$(CommonJSDefineCompiler, superclass).prototype, constructor = CommonJSDefineCompiler;
  prototype.CJS_HEADER = "require.define('/node_modules/{ID}.js', function(require, module, exports, __dirname, __filename){\n\n";
  prototype.id = 'commonjs_define';
  function CommonJSDefineCompiler(){
    superclass.apply(this, arguments);
  }
  return CommonJSDefineCompiler;
}(CommonJSCompiler));
/**
 * @class As CommonJSCompiler, but creates the module to comply with AMD's `define()`. Adding
 * an empty dependancies array tells require.js to automatically introspect the require calls.
 */
exports.AMDCompiler = AMDCompiler = (function(superclass){
  AMDCompiler.displayName = 'AMDCompiler';
  var prototype = extend$(AMDCompiler, superclass).prototype, constructor = AMDCompiler;
  prototype.CJS_HEADER = "define('{ID}', [], function(require, exports, module){\n\n";
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
  var YAML_TO_JSON, prototype = extend$(PyYamlCompiler, superclass).prototype, constructor = PyYamlCompiler;
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
for (i$ = 0, len$ = (ref$ = [CommonJSCompiler, CommonJSDefineCompiler, AMDCompiler, PyYamlCompiler]).length; i$ < len$; ++i$) {
  compiler = ref$[i$];
  register(compiler);
}
function extend$(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}
