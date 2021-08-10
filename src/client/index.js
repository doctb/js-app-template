import foobar from './foobarJs';                     // local js import
import foobarJs from '../shared/foobarJs';           // shared js import
import foobarJson from '../shared/foobarJson.json';  // shared json import
import simpleTestPackage from 'simple-test-package'; // 3rd party module import
import http from 'http';                             // node core module (testing browser polyfill)
import './foobarCss.css';                            // css import

window.addEventListener('load', () => {
  // testing local js import
  foobar.helloWorld();

  // testing shared js import
  console.log('1 + 1 = ', foobarJs.add(1, 1));

  // testing shared json import
  console.log('foo =', foobarJson.foo);

  // testing 3rd party module import
  console.log('2 + 2 = ', simpleTestPackage.sumNumbers(2, 2));

  // testing assets folder
  const image = new Image();
  image.onload = () => { document.body.appendChild(image); };
  image.src = 'assets/placeholder.jpg';

  // testing css import
  image.className = 'placeholder1';

  // testing ifdef
  /// #if IS_DEVELOPMENT
  console.log('This is a development build');
  /// #elif IS_STAGING
  console.log('This is a staging build');
  /// #elif IS_PRODUCTION
  console.log('This is a production build');
  /// #endif

  // testing node core module import
  console.log('http:', http);

  // testing environment variables
  console.log('process.env.foo =', process.env.foo);

  // tesing dynamic imports
  import(/* webpackChunkName: "hello-world-npm" */ 'hello-world-npm').then((module) => {
    console.log(module.default.helloWorld());
  });
});
