(function () {
  const lang = (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  window.location.replace('/' + lang + '/');
})();
