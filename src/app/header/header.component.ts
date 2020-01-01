import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSubscription: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService) { }

  ngOnInit() {
    this.userSubscription = this.authService.authUser.subscribe(userData => {
      this.isAuthenticated = !!userData;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onfetchRecipes() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
