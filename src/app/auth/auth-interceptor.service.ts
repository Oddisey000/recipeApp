import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.authUser.pipe(
      take(1),
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

  constructor(private authService: AuthService) { }
}
