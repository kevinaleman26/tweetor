
var url = window.location.href;
var swLocation = '/tweetor/sw.js'

if(navigator.serviceWorker){

    if(url.includes('localhost'))
        swLocation = "/sw.js"
    else


    navigator.serviceWorker.register(swLocation);
}


// Referencias de jQuery

var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario, contiene el ID del héroe seleccionado
var usuario;




// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
   modal.animate({ 
       marginTop: '+=1000px',
       opacity: 0
    }, 200, function() {
        modal.addClass('oculto');
        txtMensaje.val('');
    });
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

    crearMensajeHTML( mensaje, usuario );

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