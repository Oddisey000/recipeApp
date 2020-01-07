import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../ngrx-store/app.reducer';
import * as AuthActions from './ngrx-store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  isError: string = null;

  private closeModal: Subscription;
  private storeSub: Subscription;
  
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) { }

  private showErrorAlert(message: string) {
    const alertCompFactory = this.componentFactoryResolver
      .resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCompFactory);
    componentRef.instance.message = message;
    this.closeModal = componentRef.instance.close.subscribe(() => {
      this.closeModal.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(res => {
      this.isLoading = res.loading;
      this.isError = res.authError;

      if (this.isError) this.showErrorAlert(this.isError);
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    
    const email = form.value.email;
    const password = form.value.password;
    
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      this.store.dispatch(new AuthActions.SignupSuccess({email: email, password: password}));
    }
    
    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.HandleError());
  }

  ngOnDestroy() {
    if (this.closeModal) this.closeModal.unsubscribe();
    if (this.storeSub) this.storeSub.unsubscribe();
  }

}
