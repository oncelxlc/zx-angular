import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync(), BrowserAnimationsModule],
};
