import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromAppState from './ngrx-store/app.reducer';
import * as AuthActions from './auth/ngrx-store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromAppState.AppState>) {}
  
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
