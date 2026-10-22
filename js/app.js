/* Page behaviour: owned by Full-Stack */
(function () {
  'use strict';

  var chf = new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' });

  // Example lease rate: annuity with a residual value paid at the end.
  function monthlyRate(price, down, months, residualPct, yearlyPct) {
    var financed = price - down;
    var residual = price * residualPct / 100;
    var i = yearlyPct / 100 / 12;
    if (i === 0) return (financed - residual) / months;
    var f = Math.pow(1 + i, -months);
    return (financed - residual * f) * i / (1 - f);
  }

  var calc = document.getElementById('calc');
  if (calc) {
    var out = document.getElementById('calc-result');
    calc.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return parseFloat(calc.elements[id].value); };
      var price = v('price'), down = v('down'), term = v('term'), res = v('residual'), rate = v('interest');
      if ([price, down, term, res, rate].some(isNaN) || price <= 0 || term < 1 || down < 0 || down >= price || res < 0 || res > 100 || rate < 0 || down + price * res / 100 >= price) {
        out.textContent = 'Please check the numbers: the down payment plus the residual value must be below the price, and no value can be negative.';
        return;
      }
      var m = monthlyRate(price, down, Math.round(term), res, rate);
      out.textContent = 'Example monthly rate: ' + chf.format(m) + ' for ' + Math.round(term) +
        ' months. Residual value at the end: ' + chf.format(price * res / 100) +
        '. Example only, not an offer.';
    });
  }

  var form = document.getElementById('contact-form');
  if (form) {
    var status = document.getElementById('contact-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      [['name', 'Please enter your name.'], ['email', 'Please enter a valid email address.'], ['message', 'Please write a message.']].forEach(function (f) {
        var el = form.elements[f[0]], err = document.getElementById(f[0] + '-err');
        var bad = !el.value.trim() || (f[0] === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value));
        err.textContent = bad ? f[1] : '';
        el.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad && ok) { el.focus(); }
        if (bad) ok = false;
      });
      status.textContent = ok ? 'Thank you! This is a demo only: your message was not sent and nothing was stored.' : '';
      if (ok) form.reset();
    });
  }
})();
