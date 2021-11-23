import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './principal/principal.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileComponent } from './profile/profile.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeViewComponent } from './recipe-view/recipe-view.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path: '', redirectTo: 'principal', pathMatch: 'full'},
  {path : 'principal', component: PrincipalComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profileEdit', component: ProfileEditComponent},
  {path: 'recipe', component: RecipeComponent},
  {path: 'recipeView/:id', component: RecipeViewComponent},
  {path: 'recipeEdit/:id', component: RecipeEditComponent},
  {path: 'admin', component: AdminComponent},
  {path: '**', redirectTo: 'principal', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
