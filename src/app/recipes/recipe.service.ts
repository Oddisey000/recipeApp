import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/ngrx-store/shopping.list.actions';
import * as fromShoppingList from '../shopping-list/ngrx-store/shopping.list.reducer';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  getRecipe() {
    return this.recipes.slice();
  }

  getRecipeElement(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  constructor(private store: Store<fromShoppingList.AppState>) { }
}
