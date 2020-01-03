import { Injectable } from '@angular/core';
import { ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<ingredient[]>();
  startEditing = new Subject<number>();
  
  private ingredients: ingredient[] = [];

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: ingredient, publishChanges: boolean = true) {
    const index = this.ingredients.findIndex(ing => ing.name === ingredient.name);
  if (index === -1) {
    this.ingredients.push(ingredient);
  } else {
    this.ingredients[index].amount += ingredient.amount;
  }
  if (publishChanges) {
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  }

  addIngredients(ingredients: ingredient[]) {
    ingredients.forEach(ing => this.addIngredient(ing, false));
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  constructor() { }
}
