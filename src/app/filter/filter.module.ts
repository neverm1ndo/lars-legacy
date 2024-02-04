import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEditorComponent } from './components/filter-editor/filter-editor.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@lars/shared/shared.module';

@NgModule({
  declarations: [FilterEditorComponent],
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, SharedModule],
  exports: [FilterEditorComponent]
})
export class FilterModule {}
