/* Envoi du formulaire de devis vers laphotodromoise@gmail.com (FormSubmit).
   L'e-mail reçu indique clairement qu'il vient du site La Photo Drômoise. */
(function () {
  var DEST = 'laphotodromoise@gmail.com';
  // Adresse du script Google (Apps Script) une fois installé — voir google-apps-script/LISEZ-MOI.md.
  // Tant qu'elle est vide, les demandes passent par FormSubmit.
  var SCRIPT_GOOGLE = '';
  var forms = document.querySelectorAll('form.devis');
  if (!forms.length || !window.fetch) return;

  function frDate(d) {
    if (!d) return '';
    var p = d.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
  }

  [].forEach.call(forms, function (f) {
    var btn = f.querySelector('button[type=submit]');
    var err = document.createElement('p');
    err.className = 'devis-erreur'; err.hidden = true; err.setAttribute('role', 'alert');
    btn.insertAdjacentElement('afterend', err);
    var ok = document.createElement('div');
    ok.className = 'devis-ok'; ok.hidden = true; ok.setAttribute('role', 'status');
    ok.innerHTML = '<p class="devis-ok-titre">Merci, votre demande est bien envoyée ! 📸</p>' +
      '<p>Matthias vous répond avec un devis personnalisé sous 48 heures. ' +
      'Pensez à vérifier vos courriers indésirables.</p>';
    f.appendChild(ok);

    function fail(m) { err.textContent = m; err.hidden = false; }
    function val(name) { var el = f.elements[name]; return el && el.value ? String(el.value).trim() : ''; }
    function checked(name) {
      return [].slice.call(f.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function (i) { return i.value; }).join(', ');
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (val('_honey')) return;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      err.hidden = true;

      var nom = val('Nom'), type = val("Type d'événement") || 'Événement';
      var page = document.title.split('–')[0].trim();
      var data = {
        'Site': 'La Photo Drômoise – laphotodromoise.com',
        'Envoyé depuis la page': page,
        'Nom & prénom': nom,
        'Téléphone': val('Téléphone'),
        'E-mail': val('email'),
        "Type d'événement": type,
        "Date de l'événement": frDate(val('Date')),
        'Lieu': val('Lieu'),
        "Nombre d'invités": val('Invités') || 'Non précisé',
        'Formule souhaitée': checked('Formule') || 'Non précisée',
        'Options': checked('Options') || 'Aucune',
        'Code société': val('Code société') || '—',
        'Nous a connus par': val('Source') || 'Non précisé',
        'Message': val('Message') || '—',
        '_subject': '📸 La Photo Drômoise · Demande de devis · ' + type + ' · ' + nom,
        '_replyto': val('email'),
        '_template': 'table',
        '_captcha': 'false'
      };

      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Envoi en cours…';
      var envoi;
      if (SCRIPT_GOOGLE) {
        var p = new URLSearchParams();
        Object.keys(data).forEach(function (k) { if (k.charAt(0) !== '_') p.append(k, data[k]); });
        envoi = fetch(SCRIPT_GOOGLE, { method: 'POST', body: p })
          .then(function (r) { return r.json().catch(function () { return { success: r.ok ? 'true' : 'false' }; })
            .then(function (j) { return { ok: r.ok, j: j }; }); });
      } else {
        envoi = fetch('https://formsubmit.co/ajax/' + DEST, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); });
      }
      envoi
        .then(function (x) {
          if (x.ok && String(x.j.success) === 'true') {
            [].forEach.call(f.children, function (c) { if (c !== ok) c.hidden = true; });
            ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (/activat/i.test(String(x.j.message || ''))) {
            btn.disabled = false; btn.textContent = label;
            fail("Le formulaire n'est pas encore activé : un e-mail d'activation vient d'être envoyé à " + DEST +
              ". Cliquez sur « Activate Form » dans cet e-mail, puis renvoyez la demande.");
          } else { throw new Error(); }
        }).catch(function () {
          btn.disabled = false; btn.textContent = label;
          fail("L'envoi n'a pas abouti. Réessayez dans un instant, ou appelez-nous au 06 52 04 71 32.");
        });
    });
  });
})();
