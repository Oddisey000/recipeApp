import * as fromShoppingList from '../shopping-list/ngrx-store/shopping.list.reducer';
import * as fromAuth from '../auth/ngrx-store/auth.reducer';
import * as fromRecipes from '../recipes/ngrx-store/recipe.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.ShoppingListReducer,
  auth: fromAuth.AuthReducer,
  recipes: fromRecipes.RecipeReducer
};