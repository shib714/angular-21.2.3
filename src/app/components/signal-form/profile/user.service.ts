import { inject, Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/env.dev";

@Injectable({
    providedIn: 'root',
})
export class UserService {

    // For larger applications, it's a good practice to store base URLs 
    // in environment-specific configuration files (e.g., environment.ts).
    //private readonly url = 'https://jsonplaceholder.typicode.com/users';
    private readonly url: string = environment.USER_URL;


    //promise based
    // The implementation used an unnecessary `new Promise` and `setTimeout`.
    // Since `async` functions automatically return a Promise, we can directly
    // return the boolean result of the check. The `setTimeout` was likely for
    // simulating network delay during development and is not needed in production.

    //used in validateAsync in userNameSchema
    async checkUsernameAvailability(username: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.url}?username=${username}`);
            if (!response.ok) {
                // In a real application, you might want to handle different
                // status codes (e.g., 404, 500) in a more specific way.
                throw new Error('Failed to check username availability');
            }
            const users = await response.json();
            console.log('Available Users:', users);
            // The API returns an array of users that match the username.
            // If the array is empty, the username is available.
            return users.length === 0;
        } catch (error) {
            console.error('Error checking username availability:', error);
            // Re-throwing the error allows the caller to handle it.
            throw error;
        }
    }

    //Using HttpClient
    private http = inject(HttpClient);

    checkUsernameExists(username: string): Observable<{ taken: boolean }> {
        return this.http.get<any[]>(`${this.url}?username=${username}`).pipe(
            map(users => ({ taken: users.length > 0 })),
            catchError(error => {
                console.error('Error checking username availability:', error);
                return throwError(() => new Error('Failed to check username availability'));
            })
        );
    }
}

// For Angular applications, it is recommended to use the `HttpClient` module
// from `@angular/common/http` for making HTTP requests. It provides more
// advanced features like request/response interception, typed responses,
// and better error handling. If you decide to use it, you would inject
// the `HttpClient` in the constructor and use it like this:
//
// import { HttpClient } from '@angular/common/http';
//
// constructor(private http: HttpClient) {}
//
// checkUsernameAvailability(username: string): Observable<boolean> {
//   return this.http.get<any[]>(`${this.url}?username=${username}`).pipe(
//     map(users => users.length === 0),
//     catchError(error => {
//       console.error('Error checking username availability:', error);
//       return throwError(() => new Error('Failed to check username availability'));
//     })
//   );
// }