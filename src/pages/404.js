// src/pages/404.js

// In Next.js, quando si crea una pagina _error.js personalizzata, è fortemente
// consigliato creare anche una pagina 404.js personalizzata.
// Questo permette a Next.js di ottimizzare staticamente la pagina 404
// (cioè pre-renderizzarla in HTML al momento della build), migliorando
// le prestazioni e riducendo il carico sul server.

// Questo è un componente funzionale React di base. Verrà mostrato
// automaticamente da Next.js quando un utente visita una rotta che non esiste.
export default function Custom404() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      {/*
        Mostriamo un messaggio amichevole all'utente.
        Il tag <h1> rappresenta l'intestazione principale.
      */}
      <h1>404 - Pagina Non Trovata</h1>
      <p>Spiacenti, la pagina che stai cercando non esiste.</p>
    </div>
  );
}
