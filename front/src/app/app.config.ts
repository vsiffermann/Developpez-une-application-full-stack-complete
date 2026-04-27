import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { postsReducer } from './store/posts/posts.reducer';
import { topicsReducer } from './store/topics/topics.reducer';
import * as AuthEffects from './store/auth/auth.effects';
import * as PostsEffects from './store/posts/posts.effects';
import * as TopicsEffects from './store/topics/topics.effects';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideStore({
      auth: authReducer,
      posts: postsReducer,
      topics: topicsReducer,
    }),
    provideEffects(AuthEffects, PostsEffects, TopicsEffects),
    ...(isDevMode()
      ? [provideStoreDevtools({ maxAge: 25, logOnly: false })]
      : []),
  ],
};
