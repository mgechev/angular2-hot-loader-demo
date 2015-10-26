import {bind} from 'angular2/angular2';
import {ROUTER_BINDINGS, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {AppCmp} from './components/app/app';
import {hotLoaderBootstrap} from './hot-loader';

hotLoaderBootstrap(AppCmp, [
  ROUTER_BINDINGS,
  bind(ROUTER_PRIMARY_COMPONENT).toValue(AppCmp)
]);
