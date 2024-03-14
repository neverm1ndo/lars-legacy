import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'lars-document-tips',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './document-tips.component.html',
  styleUrls: ['./document-tips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentTipsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
