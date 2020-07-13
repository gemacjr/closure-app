import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-button',
  templateUrl: './date-button.component.html',
  styleUrls: ['./date-button.component.css']
})
export class DateButtonComponent implements OnInit {

  constructor() { }

  @Input() isSelected: boolean = false;
  @Input() isPassed: boolean = false;
  @Input() isDefault: boolean = false;
  @Input() dayOfWeek: string;
  @Input() dayOfMonth: string;

  toggleSelected(){
    this.isSelected = !this.isSelected
  }

  ngOnInit(): void {
  }

}
