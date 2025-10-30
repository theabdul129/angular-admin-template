import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExtraOptions, PreloadAllModules, RouterModule } from "@angular/router";
import { MarkdownModule } from "ngx-markdown";
import { FuseModule } from "@fuse";
import { FuseConfigModule } from "@fuse/services/config";
import { FuseMockApiModule } from "@fuse/lib/mock-api";
import { CoreModule } from "app/core/core.module";
import { appConfig } from "app/core/config/app.config";
import { mockApiServices } from "app/mock-api";
import { AppComponent } from "app/app.component";
import { appRoutes } from "app/app.routing";
import { AuthModule, AuthHttpInterceptor } from "@auth0/auth0-angular";
import { environment } from "../../src/environments/environment";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LayoutModule } from "./layout/layout.module";

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: "enabled",
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    SweetAlert2Module.forRoot(),
    // CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),

    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // Fuse, FuseConfig & FuseMockAPI
    FuseModule,
    FuseConfigModule.forRoot(appConfig),
    FuseMockApiModule.forRoot(mockApiServices),

    // Core module of your application
    CoreModule,

    // Layout module of your application
    LayoutModule,

    // 3rd party modules that require global configuration via forRoot
    MarkdownModule.forRoot({}),
    AuthModule.forRoot({
      domain: environment.domain,
      clientId: environment.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.audience,
        scope: "openid profile email",
      },
      httpInterceptor: {
        allowedList: [
          // Attach access tokens to any calls to '/api' (exact match)
          {
            uri: environment.apiUrl + "/*",
            allowAnonymous: true,
          },
          {
            uri: environment.analyticsUrl + "/*",
            allowAnonymous: true,
          },
        ],
      },
    }),
  ],
  providers: [Title, { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true }],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
