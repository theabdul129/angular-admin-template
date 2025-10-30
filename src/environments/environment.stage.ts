export const environment = {
    production: true,
    apiUrl: '//stage-merchant.api.bsktpay.co',
    domain: 'auth.bsktpay.co',
    redirectUri: '//merchant.stage.bsktpay.co',
    clientId: '7hS47S4YDsYMgU9i0V8UufvE3HoIcIzB',
    googleMapsApiKey:  'AIzaSyBV9SNFPl8-4DJDkv_FDrVt15bN1dSMPVc',
    audience: 'https://api.stage.bsktpay.co',
    managementUrl: 'https://stage-management.api.bsktpay.co',
    analyticsUrl:'https://stage-analytics.api.bsktpay.co',
    googleTagKey: 'G-B3TYNKD385',
    applicationIdentifier: 'QtsGdrVpoiTp',

};


// Make the environment variables available globally
window['__env'] = window['__env'] || {};
window['__env'].googleTagKey = environment.googleTagKey;