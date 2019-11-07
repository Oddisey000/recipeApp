import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'A simple recipe description', 'https://cdn.pixabay.com/photo/2016/04/09/09/22/pizza-1317699_1280.jpg'),
    new Recipe('A Test Recipe', 'A simple recipe description', 'https://cdn.pixabay.com/photo/2016/04/09/09/22/pizza-1317699_1280.jpg')
  ];

  constructor() { }

  ngOnInit() {
  }

}
