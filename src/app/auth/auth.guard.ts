import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { DataStorageService } from '../shared/data-storage.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../ngrx-store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataStorageService: DataStorageService,
    private store: Store<fromApp.AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): 
    boolean 
    | UrlTree 
    | Promise<boolean | UrlTree> 
    | Observable<boolean | UrlTree> {
      return this.store.select('auth').pipe(
        take(1),
        map(authState => { return authState.user }),
        map(user => {
          const isAuth = !!user;
          
          if (isAuth) {
            this.dataStorageService.fetchRecipes().subscribe();
            return true;
          } else {
            return this.router.createUrlTree(['/auth']);
          }
      }));
  }
}