import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Store } from '@ngrx/store';
import * as fromAppState from './ngrx-store/app.reducer';
import * as AuthActions from './auth/ngrx-store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<fromAppState.AppState>,
    @Inject(PLATFORM_ID) private platformId) {}
  
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.store.dispatch(new AuthActions.AutoLogin());
  }
}
