
importScripts("js/sw-utils.js");

const STATIC_CACHE      = 'static-v2'
const DYNAMIC_CACHE     = 'dynamic-v1'
const INMUTABLE_CACHE   = 'inmutable-v1'

const APP_SHELL = [
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js',
    'index.html'
    //'/'
];

const INMUTABLE_SHELL = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/animate.css',
    'js/libs/jquery.js',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
];

self.addEventListener('install',e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(INMUTABLE_SHELL));

    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys()
    .then(keys => {

        keys.forEach(key => {

            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

        });
    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then( res => {

        if(res) {
            return res;
        } else {
            return fetch(e.request).then(resp => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, resp);

            });
        }
        
    });

    e.respondWith( respuesta );
});


export const pwaTrackingListeners = () => {
    const fireAddToHomeScreenImpression = event => {
      fireTracking("Add to homescreen shown");
      //will not work for chrome, untill fixed
      event.userChoice.then(choiceResult => {
        fireTracking(`User clicked ${choiceResult}`);
      });
      //This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
      window.removeEventListener(
        "beforeinstallprompt",
        fireAddToHomeScreenImpression
      );
    };
    window.addEventListener("beforeinstallprompt", fireAddToHomeScreenImpression);
    
    //Track web app install by user
    window.addEventListener("appinstalled", event => {
      fireTracking("PWA app installed by user!!! Hurray");
    });
  
    //Track from where your web app has been opened/browsed
    window.addEventListener("load", () => {
      let trackText;
      if (navigator && navigator.standalone) {
        trackText = "Launched: Installed (iOS)";
      } else if (matchMedia("(display-mode: standalone)").matches) {
        trackText = "Launched: Installed";
      } else {
        trackText = "Launched: Browser Tab";
      }
      fireTracking(track);
    });
  };