/* Navigation behaviour: owned by UI/UX */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  document.documentElement.classList.add('js');
  var wide = window.matchMedia('(min-width: 48rem)');

  function set(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.hidden = !open;
  }
  function sync() { set(wide.matches); }

  toggle.addEventListener('click', function () {
    set(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !wide.matches && toggle.getAttribute('aria-expanded') === 'true') {
      set(false);
      toggle.focus();
    }
  });
  if (wide.addEventListener) wide.addEventListener('change', sync); else wide.addListener(sync);
  sync();
})();
