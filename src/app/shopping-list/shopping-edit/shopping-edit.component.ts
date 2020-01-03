import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItem: ingredient;
  editedItemIndex: number;
  
  constructor(private shoppingListService: ShoppingListService) { }
  
  @ViewChild('formLocalReference', {static: false}) form: NgForm;

  ngOnInit() {
    this.subscription = this.shoppingListService.startEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.editMode = true;

        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onAddItem() {
    const value = this.form.value;
    const newIngredient = new ingredient(value.name, +value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }

    this.editMode = false;
    this.form.reset();
  }

  onClear() {
    this.form.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
