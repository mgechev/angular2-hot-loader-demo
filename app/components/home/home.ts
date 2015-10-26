import {Component, NgFor} from 'angular2/angular2';
import {NameList} from '../../services/name_list';

@Component({
  selector: 'home',
  directives: [NgFor],
  template: `
    <h1>Howdy!</h1>

    <h2>
      Gratz!
    </h2>

    <ul>
      <li *ng-for="#name of nameList.names">
        {{name}}
      </li>
    </ul>

    <p class="note">
      The angular2-seed based demo of the Angular 2 hot loader works!
    </p>
  `
})
export class HomeCmp {
  constructor(private nameList: NameList) {}
}
