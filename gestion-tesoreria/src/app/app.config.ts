import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { getPaginatorIntlEs } from './shared/mat-paginator-intl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from './services/auth.service';
import { provideToastr } from 'ngx-toastr';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    { provide: MatPaginatorIntl, useValue: getPaginatorIntlEs() },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideHttpClient(
        withInterceptors([jwtInterceptor]),
        withInterceptorsFromDi()  
    ),
    provideAppInitializer(() => inject(AuthService).init()),
    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 4000,
      closeButton: true,
      progressBar: true
    })
  ]
};

