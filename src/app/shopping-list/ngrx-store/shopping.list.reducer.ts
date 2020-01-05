import * as ShoppingListActions from './shopping.list.actions';
import { ingredient } from 'src/app/shared/ingredient.model';

export interface AppState {
  shoppingList: State;
}

export interface State {
  ingredients: ingredient[];
  editedIngredient: ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function ShoppingListReducer(
  state: State = initialState, 
  action: ShoppingListActions.ShoppingListActions) {
    switch (action.type) {
      case ShoppingListActions.ADD_INGREDIENT:
        const index = [...state.ingredients].findIndex(ing => ing.name === action.payload.name);
        if (index === -1) {
          state.ingredients.push(action.payload);
        } else {
          state.ingredients[index].amount += action.payload.amount;
        }
        return {
          ...state,
          ingredients: [...state.ingredients]
        };
      
      case ShoppingListActions.ADD_INGREDIENTS:
        for (let ingredient of [...action.payload]) {
          const index = [...state.ingredients].findIndex(ing => ing.name === ingredient.name);
          if (index === -1) {
            state.ingredients.push(ingredient);
          } else {
            state.ingredients[index].amount += ingredient.amount;
          }
        }
        return {
          ...state,
          ingredients: [...state.ingredients]
        };

      case ShoppingListActions.UPDATE_INGREDIENT:
        const ingredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
          ...ingredient,
          ...action.payload
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
        return {
          ...state,
          ingredients: updatedIngredients,
          editedIngredientIndex: -1,
          editedIngredient: null
        };

      case ShoppingListActions.DELETE_INGREDIENT:
        return {
          ...state,
          ingredients: state.ingredients.filter((ingredient, index) => {
            return index !== state.editedIngredientIndex;
          }),
          editedIngredient: null,
          editedIngredientIndex: -1
        };

      case ShoppingListActions.START_EDIT:
        return {
          ...state,
          editedIngredientIndex: action.payload,
          editedIngredient: {...state.ingredients[action.payload]}
        };

      case ShoppingListActions.STOP_EDIT:
        return {
          ...state,
          editedIngredient: null,
          editedIngredientIndex: -1
        };

      default:
        return state;
    }
}