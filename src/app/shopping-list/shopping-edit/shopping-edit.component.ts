import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  // Using locale reference to take value
  @ViewChild('nameInput', { static: false }) nameInputReference: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputReference: ElementRef;

  // Create new event emitter with name and amount element's data and listen it from outside
  @Output() newIngredientAdded = new  EventEmitter<ingredient>();

  constructor() { }

  ngOnInit() {
  }

  onAddItem() {
    // Create new ingredient using a model and local reference
    const newIngredient = new ingredient(
      this.nameInputReference.nativeElement.value,
      this.amountInputReference.nativeElement.value);
    
      // Emmit new event with the data
      this.newIngredientAdded.emit(newIngredient);
  }

}
