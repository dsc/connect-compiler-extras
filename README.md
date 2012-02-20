# connect-compiler-extras

Custom compilers for [connect-compiler](http://github.com/dsc/connect-compiler), which scratch my own
itches -- specifically, a compiler to decorate files with the [CommonJS](http://commonjs.org)
machinery, and a simple [YAML](http://yaml.org)-to-[JSON](http://json.org) compiler.

Usage is the same as the `connect-compiler` middleware -- in fact, I recommend you substitute
the compiler reference you get from `connect-compiler-extras` to ensure both modules point
at the same middleware:

```js
    var connect  = require('connect')
    ,   compiler = require('connect-compiler-extras')
    
    ,   server = connect.createServer(
            connect.logger(),
            compiler({
                enabled : [ 'coffee', 'uglify' ],
                src     : 'src',
                dest    : 'var'
            }),
            compiler({
                enabled : 'commonjs',
                src     : ['src', 'var'],
                dest    : 'var',
                options : {
                    commonjs: { drop_path_parts:1 }
                }
            }),
            connect.static(__dirname + '/public'),
            connect.static(__dirname + '/var')
        )
    ;
    
    server.listen(6969);
```


## Installation

Via [npm](http://npmjs.org/), though I don't reliably publish it as nobody else cares.

```sh
git clone https://github.com/dsc/connect-compiler-extras.git
cd connect-compiler-extras
npm link
```

Use it in any other project by running the `link` in your project directory:

```sh
npm link connect-compiler-extras
```


## Compilers

### CommonJSCompiler

**ID:** `commonjs`

Wraps JS modules in a CommonJS module definition.

Here's the itch: `browserify` and its ilk work poorly with [Coco](http://github.com/satyr/coco)
(often because they look explicitly for `.js` or `.coffee` files when doing module lookup, despite
Coco properly handling the node import hook). Further, I prefer to send down each module as a
separate file during development for ease of debugging (better stacks, esp). My solution is a
`CommonJSCompiler` that handles requests for `.mod.js` by wrapping the appropriate `.js` file.

Using the compiler is straight-forward -- just request your files as `.mod.js` instead of `.js`.
The wrapper assumes the `require` machinery and the `require.install()` function from the
[helper library](blob/master/require-install.js) are both on the page. I generally use the
bootstrapper from [browserify](https://github.com/substack/node-browserify) as well, which works
great when when it comes down first.

**Options:**

 - `drop_path_parts` [default: `0`] &mdash; Removes this many leading directory path parts. Let's
   say your JS modules have a deep and irrelevant path, like
   `/~me/hacking/foo-app/static/js/foo/bar.mod.js` for the module `foo/bar`. To avoid having to
   require with that ridiculous prefix, you'd use `{ drop_path_parts:5 }` to drop the mountpoint
   (`/~me/hacking/foo-app/static/js`).
 - `drop_full_ext` [default: `true`] &mdash; Removes everything after the first dot in the basename,
   otherwise `.mod(.min)?.js`.
 - `drop_pat` [default: `null`] &mdash; Overrides the file-to-module pattern. If omitted, determined
   by `drop_full_ext`.


### PyYamlCompiler

**ID:** `pyyaml`

A [YAML](http://yaml.org)-to-[JSON](http://json.org) compiler. No options; merely point your browser
at a non-existent JSON file when it has a YAML counterpart. For example, requesting
`/data/options.json` when only `/data/options.yaml` exists will compile the latter to the former.
`PyYamlCompiler` obeys `src` and `dest` like every other `connect-compiler`.

If you happen to (somehow) have [my python utility library](https://github.com/dsc/py-lessly)
installed, it will use the
[`OrderedDict` patch](https://github.com/dsc/py-lessly/blob/master/lessly/data/yaml_omap.py) to
preserve key order. This is not required; works fine without it.


## Feedback

Find a bug or want to contribute? Open a ticket on [github](http://github.com/dsc/connect-compiler-extras).
You're also welcome to send me email at [dsc@less.ly](mailto:dsc@less.ly?subject=connect-compiler-extras).


