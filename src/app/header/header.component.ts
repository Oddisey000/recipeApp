import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  // Work with selected recipe of shopping list item
  @Output() selectedData = new EventEmitter<string>();
  onSelect(data: string) {
    this.selectedData.emit(data);
  }

  constructor() { }

  ngOnInit() {
  }

}
