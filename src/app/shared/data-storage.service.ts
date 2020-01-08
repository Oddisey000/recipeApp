import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../ngrx-store/app.reducer';
import * as RecipesActions from '../recipes/ngrx-store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  url: string = 'https://ng-test-project-9f8aa.firebaseio.com/recipes.json';

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>) { }

  storeRecipes() {
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }), tap(recipes => {
        this.store.dispatch(new RecipesActions.SetRecipes(recipes));
      })
    );
  }
}
