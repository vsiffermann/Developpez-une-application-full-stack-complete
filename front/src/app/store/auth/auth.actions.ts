import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../shared/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Register': props<{ email: string; username: string; password: string }>(),
    'Register Success': props<{ user: User; token: string }>(),
    'Register Failure': props<{ error: string }>(),
    'Login': props<{ identifier: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Load User': emptyProps(),
    'Load User Success': props<{ user: User }>(),
    'Update Profile': props<{ email?: string; username?: string; password?: string }>(),
    'Update Profile Success': props<{ user: User }>(),
    'Update Profile Failure': props<{ error: string }>(),
  },
});
