import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getPaginatorIntlEs } from './shared/mat-paginator-intl';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideHttpClient } from '@angular/common/http'; // ✅ importante si usas HttpClient
import { withInterceptorsFromDi } from '@angular/common/http';
import { withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor'; // ruta correcta
import { AuthService } from './services/auth.service'; // ajusta ruta si es necesario


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
        withInterceptorsFromDi()  // por si usas interceptores clásicos también
    ), // ✅ esto reemplaza a HttpClientModule

    provideAppInitializer(() => inject(AuthService).init()),
  ]
};

