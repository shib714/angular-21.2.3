import { apply, applyWhen, debounce, disabled, minLength, required, schema, validate, validateHttp } from "@angular/forms/signals"
import { environment } from "../../../environments/env.dev";


export interface Profile {
    userName: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    password: string,
    confirmPassword: string,
    hasEmergencyContact: boolean,
    emergencyContactName: string,
    emergencyContactPhone: string,

}

export const defaultProfile: Profile = {
    userName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    hasEmergencyContact: false,
    emergencyContactName: '',
    emergencyContactPhone: '',
}

export const profileValidationSchema = schema<Profile>((path) => {
    //validate userName
    apply(path, userNameValidationSchema);
    //validate firstName
    required (path.firstName, {message: 'First Name is required'});
    //validate lastName
    required (path.lastName, {message: 'Last Name is required'});
    //validate password & confirmpassword
    apply(path, passwordValidationSchema);
    //validate date of birth
    apply(path, dateOfBirthValidationSchema);
    //validate emergency contact
    apply(path, emergencyContactValidationSchema);

})

export const userNameValidationSchema = schema<{userName:string}>((path) => {
    required (path.userName, {message: 'User Name is required'});
    // validate(path.userName, ({ value }) => {
    //     const username = value();
    //     if (!username.includes(' ')) {
    //         return { kind: 'no-spaces', message: 'Name cannot contain spaces' };
    //     }
    //     return undefined;//no erroe
    // });



    //wait 500 milisecs for the user to type before run validation
    debounce(path.userName, 500);
    //check to see if the user name already exists
    // there are two ways to validate - validateAsync or validateHttp
    //For details: https://angular.dev/guide/forms/signals/async-operations#next-steps   
    validateHttp(path.userName, {
        //request function receives the field context and returns the url or request for the httpResource. 
        // If given a URL, the underlying httpResource will perform an HTTP GET on it.
        //The request function returns either a URL string or an HttpResourceRequest object. 
        // Return undefined to skip the validation:
        request: ({value}) => {
            const username = value();
            return username ? `${environment.USER_URL}?username=${username}` : undefined;
        },
        onSuccess: (users: any[]) => {
            return users.length > 0 ? {kind: 'taken', message: 'The username is already taken'}: null;
        },
        onError: (error: any) => {
           console.error('Validation request failed:', error);
           return {kind: 'server-error', message:'Error checking availability' }
        }
    });
})

const passwordValidationSchema = schema<{password: string, confirmPassword: string}>((path) => {
    required (path.password, {message: 'Password is required'});
    required (path.confirmPassword, {message: 'Confirm Password is required'});
    minLength(path.password, 8, {message: 'Password must be at least 8 characters'});
    minLength(path.confirmPassword, 8, {message: 'Confirm Password must be at least 8 characters'});
    //cross field validation
    validate(path.confirmPassword, (ctx) => {
        if(!ctx.value()) return null;
        const password = ctx.valueOf(path.password);
        if(password !== ctx.value()) {
            return {kind: 'passwordMismatch', message: 'Password does not match'}
        }
        return null;
    })
})

const dateOfBirthValidationSchema = schema<{ dateOfBirth: string }>((path) => {
    required(path.dateOfBirth, { message: 'Date of birth is required' });
    validate(path.dateOfBirth, (ctx) => {
        if (!ctx.value()) return null;

        const birthDate = new Date(ctx.value());
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            return {
                kind: 'underage',
                message: 'You must be at least 18 years old'
            }
        }
        return null;
    });
});


const emergencyContactValidationSchema = schema<{ hasEmergencyContact: boolean, emergencyContactName: string, emergencyContactPhone: string }>((path) => {
    // When hasEmergencyContact is true, make the contact name and phone required.
    required(path.emergencyContactName, {
        message: 'Emergency contact name is required',
        when: ({ valueOf }) => valueOf(path.hasEmergencyContact)
    });

    required(path.emergencyContactPhone, {
        message: 'Emergency contact phone is required',
        when: ({ valueOf }) => valueOf(path.hasEmergencyContact)
    });

    // When hasEmergencyContact is true, also require a minLength for the phone number.
    applyWhen(
        path.emergencyContactPhone,
        ({ valueOf }) => valueOf(path.hasEmergencyContact),
        (field) => {
            minLength(field, 10, { message: 'Phone number should be at least 10 characters long' });
        }
    );
    disabled(path.emergencyContactName, ({ valueOf }) => !valueOf(path.hasEmergencyContact));
    disabled(path.emergencyContactPhone, ({ valueOf }) => !valueOf(path.hasEmergencyContact));
});
