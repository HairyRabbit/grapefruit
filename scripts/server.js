// @flow

import webpack from 'webpack'
import path    from 'path'
import fs      from 'fs'
import pkg     from '../package.json'

/**
 * get package config value
 */
function getPackageConfig(prop) {
  return pkg[prop]
}

/**
 * make dll bundle
 */
function makeDll(callback) {
  const deps = Object.keys(getPackageConfig('dependencies'))
  const dllKey = 'vendor'
  const dllOutputPath = path.resolve('tmp')
  const options = {
    entry: {
      [dllKey]: [
        path.resolve('node_modules/react/umd/react.development.js')
      ]
    },
    mode: 'development',
    output: {
      path: dllOutputPath,
      filename: '[name].js',
      library: '[name]'
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.resolve(dllOutputPath, dllKey + '-manifest.json'),
        name: "[name]"
      })
    ]
  }
  const compile = webpack(options)
  return new Promise(function(resolve, reject) {
    compile.run(function(err, data) {
      if(err) return reject()
      resolve(data)
    })
  })
}


/**
 * check dll bundles.
 */

function checkDLL() {}

/**
 * main entry
 */
function main() {
  makeDll()
    .then(data => console.log(data.toString({ color: true })))
}

main()
