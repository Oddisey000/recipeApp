import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe', 
      'A simple recipe description', 
      'https://cdn.pixabay.com/photo/2016/04/09/09/22/pizza-1317699_1280.jpg',
      [
        new ingredient('Meat', 1),
        new ingredient('French Fries', 20)
      ]),
    new Recipe(
      'A Test Recipe', 
      'A simple recipe description', 
      'https://www.tablefortwoblog.com/wp-content/uploads/2018/05/eggplant-parmesan-recipe-photos-tablefortwoblog-1.jpg',
      [
        new ingredient('Beans', 3),
        new ingredient('Meat', 1)
      ])
  ];

  getRecipe() {
    return this.recipes.slice();
  }

  getRecipeElement(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
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

  constructor(private shoppingListService: ShoppingListService) { }
}
