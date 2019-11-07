import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipeApp';

  dataToLoad = 'recipe';
  onNavigate(data: string) {
    this.dataToLoad = data;
  }
}
