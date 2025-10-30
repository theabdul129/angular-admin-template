// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
apiUrl: "https://stage-merchant.api.bsktpay.co",
   //  apiUrl: "http://localhost:8080",
  domain: "auth.bsktpay.co",
  redirectUri: "//localhost:4200",
  clientId: "7hS47S4YDsYMgU9i0V8UufvE3HoIcIzB",
  googleMapsApiKey: "AIzaSyBV9SNFPl8-4DJDkv_FDrVt15bN1dSMPVc",
  audience: "https://api.stage.bsktpay.co",
  managementUrl: "http://localhost:8090",
  analyticsUrl: "https://stage-analytics.api.bsktpay.co",
  googleTagKey: "G-B3TYNKD385",
  // notification center
  applicationIdentifier: "QtsGdrVpoiTp",
};

// Make the environment variables available globally
window["__env"] = window["__env"] || {};
window["__env"].googleTagKey = environment.googleTagKey;
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
