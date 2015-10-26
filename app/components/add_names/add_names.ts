import {Component} from 'angular2/angular2';

import {NameList} from '../../services/name_list';

@Component({
  selector: 'add-names',
  template: `
  <h1>Add names</h1>
  <input #newname/>
  <button (click)="addName(newname)">Add Name</button>
  `
})
export class AddNamesCmp {
  constructor(public list: NameList) {}
  addName(newNameInput) {
    this.list.add(newNameInput.value);
    newNameInput.value = '';
  }
}
