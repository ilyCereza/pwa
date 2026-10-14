const VAPID_PUBLIC_KEY = 'BGLtFaIu1SocApZ8DlSWmgpGhPxLBCQmfGMTBJEcBQ1VDcHOBdYMinNNn4eKSyodEcnBk8_GdPVIJLe63UyhAkw';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}


// postBtn.on('click', function() {

//     var mensaje = txtMensaje.val();
//     if (mensaje.length === 0) {
//         cancelarBtn.click();
//         return;
//     }

//     crearMensajeHTML(mensaje, usuario);

//     fetch('http://localhost:3000/api/push', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ title: '@' + usuario, body: mensaje })
//         }).then(res => res.json())
//         .then(res => console.log('app.js', res))
//         .catch(err => console.log('Error:', err));

// });

const btnNotificaciones = document.getElementById('#btnNotificaciones');

btnNotificaciones.addEventListener('click', async function() {
    console.log('Click en notificaciones');
    var permiso = await Notification.requestPermission();
    if (permiso != 'granted') return;

    const register = await navigator.serviceWorker.ready;

    var sub = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log(JSON.stringify(sub));
    const response = await fetch('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sub)
    });

    console.log(await response.json())
});


// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .catch(function(err) {
                console.log('Error al registrar el SW:', err);
            });
    });
}

if (!('Notification' in window) || !('PushManager' in window)) {
    console.log('Este navegador no soporta notificaciones push');
}