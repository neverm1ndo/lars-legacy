import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  constructor() { }

  @Input('textplane') textplane: string;

  ngOnInit(): void {
  }

}
