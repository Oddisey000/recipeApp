import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class ResipesResolverService implements Resolve<Recipe[]> {
  recipes = this.recipeService.getRecipe();

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return this.recipes;
    }
  }

  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService) { }
}
