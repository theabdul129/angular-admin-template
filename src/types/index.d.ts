export {};

declare global {
  interface Window {
    dataLayer: any[]; // whatever type you want to give. (any,number,float etc)
  }
}