import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions
} from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    BrowserAnimationsModule,
    provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ],
};
