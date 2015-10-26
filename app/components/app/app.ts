import {Component, bind, ViewEncapsulation} from 'angular2/angular2';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';
// import {HTTP_BINDINGS} from 'http/http';

import {HomeCmp} from '../home/home';
import {AddNamesCmp} from '../add_names/add_names';
import {NameList} from '../../services/name_list';

@Component({
  selector: 'app',
  providers: [bind(NameList).toValue(new NameList())],
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/add_names', component: AddNamesCmp, as: 'AddNames' }
])
export class AppCmp {}
