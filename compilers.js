var fs, path, register, Compiler, ExternalCompiler, compiler, exports, CommonJSCompiler, PyYamlCompiler, _ref, _i, _len;
fs = require('fs');
path = require('path');
compiler = (_ref = require('connect-compiler'), register = _ref.register, Compiler = _ref.Compiler, ExternalCompiler = _ref.ExternalCompiler, _ref);
module.exports = exports = compiler;
exports.CommonJSCompiler = CommonJSCompiler = (function(superclass){
  CommonJSCompiler.displayName = 'CommonJSCompiler';
  var prototype = __extend(CommonJSCompiler, superclass).prototype, constructor = CommonJSCompiler;
  prototype.CJS_HEADER = "require.install('{ID}', function(require, exports, module, undefined){\n\n";
  prototype.CJS_FOOTER = "\n\n});\n";
  prototype.id = 'commonjs';
  prototype.match = /\.mod(\.min)?\.js$/i;
  prototype.ext = ['.js', '.co', '.coffee', '.jison'];
  prototype.destExt = '.mod.js';
  prototype.ext2wraps = {
    co: 'coco',
    coffee: 'coffee',
    jison: 'jison'
  };
  prototype.drop_path_parts = 0;
  function CommonJSCompiler(){
    superclass.apply(this, arguments);
  }
  prototype.matches = function(srcDir, pathname){
    var src, ext;
    src = path.join(srcDir, pathname);
    if (this.match.exec(pathname)) {
      return (function(){
        var _i, _ref, _len, _results = [];
        for (_i = 0, _len = (_ref = this.ext).length; _i < _len; ++_i) {
          ext = _ref[_i];
          _results.push(src.replace(this.match, ext));
        }
        return _results;
      }.call(this));
    }
  };
  prototype.compileSync = function(data){
    var drop, mod_parts, mod_id, header, _ref;
    drop = (_ref = this.info.drop_path_parts) != null
      ? _ref
      : this.drop_path_parts;
    mod_parts = this.info.url.slice(1).replace(/\.mod(\.min)?\.js([?#].*)?$/i, '').split('/').slice(drop);
    if (mod_parts[mod_parts.length - 1] === 'index') {
      mod_parts.pop();
    }
    mod_id = path.normalize(mod_parts.join('/'));
    header = this.CJS_HEADER.replace('{ID}', mod_id);
    return header + data + this.CJS_FOOTER;
  };
  prototype.doCompile = function(text, wrapped, cb){
    var ext;
    ext = /\.([^\.]+)$/.exec(this.info.src)[1];
    this.wraps = this.ext2wraps[ext];
    return superclass.prototype.doCompile.apply(this, arguments);
  };
  return CommonJSCompiler;
}(Compiler));
exports.PyYamlCompiler = PyYamlCompiler = (function(superclass){
  PyYamlCompiler.displayName = 'PyYamlCompiler';
  var prototype = __extend(PyYamlCompiler, superclass).prototype, constructor = PyYamlCompiler;
  prototype.id = 'pyyaml';
  prototype.match = /\.json$/i;
  prototype.ext = '.yaml';
  prototype.cmd = "python -c 'import lessly.data.yaml_omap; import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout)'";
  function PyYamlCompiler(){
    superclass.apply(this, arguments);
  }
  return PyYamlCompiler;
}(ExternalCompiler));
for (_i = 0, _len = (_ref = [CommonJSCompiler, PyYamlCompiler]).length; _i < _len; ++_i) {
  compiler = _ref[_i];
  register(compiler);
}
function __extend(sub, sup){
  function fun(){} fun.prototype = (sub.superclass = sup).prototype;
  (sub.prototype = new fun).constructor = sub;
  if (typeof sup.extended == 'function') sup.extended(sub);
  return sub;
}