import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mapCorrectorValueValidator } from '../../shared/directives/map-corrector-validator.directive';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'map-corrector',
  templateUrl: './map-corrector.component.html',
  styleUrls: ['./map-corrector.component.scss']
})
export class MapCorrectorComponent implements OnInit {

  @Input('toCorrect') toCorrect: number;
  @Input('icon') icon: any;
  @Input('title') title: string;
  @Output('corrected') corrected: EventEmitter<number> = new EventEmitter<number>();

  fa = {
    check: faCheckCircle
  }


  correctorForm = new FormGroup({
    corrector: new FormControl(0, [
      Validators.required,
      mapCorrectorValueValidator()
    ]),
  });

  constructor() { }

  correct() {
    this.corrected.emit(this.correctorForm.value.corrector);
  }

  ngOnInit(): void {
    this.correctorForm.setValue({ corrector: this.toCorrect });
  }

}
