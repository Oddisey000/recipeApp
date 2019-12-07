import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  // Using locale reference to take value
  @ViewChild('nameInput', { static: false }) nameInputReference: ElementRef;
  @ViewChild('amountInput', { static: false }) amountInputReference: ElementRef;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
  }

  onAddItem() {
    // Create new ingredient using a model and local reference
    const newIngredient = new ingredient(
      this.nameInputReference.nativeElement.value,
      this.amountInputReference.nativeElement.value);
      this.shoppingListService.addIngredient(newIngredient);
  }

}
