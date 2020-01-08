import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../ngrx-store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/ngrx-store/auth.actions';
import * as RecipeActions from '../recipes/ngrx-store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select('auth')
    .pipe(map(authData => { return authData.user }))
    .subscribe(userData => {
      this.isAuthenticated = !!userData;
    });
  }

  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipe());
  }

  onfetchRecipes() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogOut() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
