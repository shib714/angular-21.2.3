import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        pathMatch: 'full', redirectTo: 'home', title: 'Home'
    },

    {
        path: 'home',
        loadComponent: () => import('./components/home/home')
            .then((m) => m.Home), title: 'Home'
    },
        {
        path: 'profile-form',
        loadComponent: () => import('./components/signal-form/profile/profile-form/profile-form')
            .then((m) => m.ProfileForm), title: 'Profile Signal Form'
    },


];
