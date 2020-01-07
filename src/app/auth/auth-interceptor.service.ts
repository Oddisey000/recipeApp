import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../ngrx-store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => { return authState.user }),
      exhaustMap(userData => {
        if(!userData) return next.handle(req);
        
        const modifiedReq = req.clone(
          {
            params: new HttpParams().set('auth', userData.token)
          }
        );
        return next.handle(modifiedReq);
      })
    );
  }

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>) { }
}
