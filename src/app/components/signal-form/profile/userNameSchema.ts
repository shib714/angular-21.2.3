import { schema, required, debounce, validate, validateHttp, validateAsync } from "@angular/forms/signals";
import { UserService } from "./user.service";
import { resource } from "@angular/core";



//this schema demonstrates the use of userService to check user availability used by validateAsync function
export const userNameSchema = (userService: UserService) => schema<{ userName: string }>((path) => {
    required(path.userName, { message: 'User name is required' });
    // validate(path.userName, ({ value }) => {
    //     const username = value();
    //     if (!username.includes(' ')) {
    //         return { kind: 'no-spaces', message: 'Name cannot contain spaces' };
    //     }
    //     return undefined;//no erroe

    // });

    debounce(path.userName, 300);

    //we could also use validateAsync() function with the help of userService: see line 5 above
    //Here is the working code for validateAsync:
    //Please see angular doc at: https://angular.dev/guide/forms/signals/async-operations
    validateAsync(path.userName, {
        params: ({ value }) => {
            const val = value();
            if (!val || val.length < 4) return undefined;
            return val;
        },
        factory: username =>
            resource({
                params: username,
                loader: async ({ params: username }) => {
                    const available = await userService.checkUsernameAvailability(username);
                    return available;
                }
            }),
        onSuccess: (result: boolean) => {
            if (!result) {
                return {
                    kind: 'username_taken',
                    message: 'This username is already taken',
                };
            }
            return null;
        },
        onError: (error: unknown) => {
            console.error('Validation error:', error);
            return null;
        }
    });
});


