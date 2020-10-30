import { Component, OnInit, Input } from '@angular/core';
import { faSave, faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  constructor() { }

  fa = {
    save: faSave,
    fetch: faSync
  }

  @Input('status') changed: boolean;

  @Input('textplane') textplane: string;

  ngOnInit(): void {
  }

}
