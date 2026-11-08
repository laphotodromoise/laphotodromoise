/**
 * La Photo Drômoise – réception des demandes de devis du site
 * ------------------------------------------------------------
 * Ce script reçoit le formulaire du site et envoie à laphotodromoise@gmail.com
 * un e-mail mis en page aux couleurs du site (noir & cuivre).
 * Il enregistre aussi chaque demande dans une feuille Google Sheets (optionnel).
 *
 * Installation : voir LISEZ-MOI.md dans ce dossier.
 */

var CONFIG = {
  destinataire: 'laphotodromoise@gmail.com',
  nomExpediteur: 'Site La Photo Drômoise',
  logo: 'https://www.laphotodromoise.com/images/2be35024fd.png',
  site: 'https://www.laphotodromoise.com/',
  enregistrerDansSheets: true            // false pour ne pas créer de tableau de suivi
};

// Ordre et libellés des champs affichés dans l'e-mail
var CHAMPS = [
  ['Nom & prénom', 'Nom & prénom'],
  ['Téléphone', 'Téléphone'],
  ['E-mail', 'E-mail'],
  ["Type d'événement", "Type d'événement"],
  ["Date de l'événement", "Date de l'événement"],
  ['Lieu', 'Lieu'],
  ["Nombre d'invités", "Nombre d'invités"],
  ['Formule souhaitée', 'Formule souhaitée'],
  ['Options', 'Options'],
  ['Code société', 'Code société'],
  ['Nous a connus par', 'Nous a connus par']
];

function doPost(e) {
  var d = (e && e.parameter) || {};
  if (d._honey) return json_({ success: 'true' });           // robot : on ignore sans rien dire
  if (!d['Nom & prénom'] || !d['E-mail']) return json_({ success: 'false', message: 'Champs manquants' });

  var type = d["Type d'événement"] || 'Événement';
  var nom = d['Nom & prénom'];
  var sujet = '📸 La Photo Drômoise · Demande de devis · ' + type + ' · ' + nom;

  MailApp.sendEmail({
    to: CONFIG.destinataire,
    replyTo: d['E-mail'],
    name: CONFIG.nomExpediteur,
    subject: sujet,
    htmlBody: emailHtml_(d),
    body: emailTexte_(d)
  });

  if (CONFIG.enregistrerDansSheets) {
    try { enregistrer_(d); } catch (err) { console.error(err); }
  }
  return json_({ success: 'true' });
}

function doGet() {
  return ContentService.createTextOutput('Formulaire La Photo Drômoise : en service.');
}

/* ---------- E-mail HTML (styles en ligne pour Gmail) ---------- */
function emailHtml_(d) {
  var cuivre = '#c48a52', noir = '#0b0b0b', carte = '#161310', ligne = '#3a2c1e', texte = '#efe7dd', gris = '#b3a89c';
  var esc = function (s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var tel = String(d['Téléphone'] || '').replace(/[^0-9+]/g, '');

  var lignes = CHAMPS.map(function (c) {
    var v = d[c[0]];
    if (!v) return '';
    var val = esc(v);
    if (c[0] === 'E-mail') val = '<a href="mailto:' + esc(v) + '" style="color:' + cuivre + ';text-decoration:none">' + val + '</a>';
    if (c[0] === 'Téléphone' && tel) val = '<a href="tel:' + tel + '" style="color:' + cuivre + ';text-decoration:none">' + val + '</a>';
    return '<tr>' +
      '<td style="padding:11px 14px;border-bottom:1px solid ' + ligne + ';color:' + gris + ';font-size:13px;width:38%;vertical-align:top">' + c[1] + '</td>' +
      '<td style="padding:11px 14px;border-bottom:1px solid ' + ligne + ';color:' + texte + ';font-size:15px;font-weight:bold;vertical-align:top">' + val + '</td>' +
      '</tr>';
  }).join('');

  var message = d['Message'] && d['Message'] !== '—'
    ? '<tr><td style="padding:0 28px 8px"><p style="margin:24px 0 10px;color:' + cuivre + ';font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Message du client</p>' +
      '<div style="background:' + carte + ';border-left:3px solid ' + cuivre + ';border-radius:6px;padding:16px 18px;color:' + texte + ';font-size:15px;line-height:1.6;font-style:italic">' +
      esc(d['Message']).replace(/\n/g, '<br>') + '</div></td></tr>'
    : '';

  var bouton = function (href, txt, plein) {
    return '<a href="' + href + '" style="display:inline-block;margin:6px;padding:13px 24px;border-radius:6px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;' +
      (plein ? 'background:' + cuivre + ';color:#140d06;border:1px solid #d9a96a' : 'color:' + cuivre + ';border:1px solid ' + cuivre) + '">' + txt + '</a>';
  };

  return '' +
  '<div style="margin:0;padding:24px 12px;background:#000;font-family:Arial,Helvetica,sans-serif">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:' + noir + ';border:1px solid ' + ligne + ';border-radius:14px;overflow:hidden">' +
    // En-tête
    '<tr><td style="padding:30px 28px 22px;text-align:center;background:' + noir + ';background-image:radial-gradient(ellipse at 50% 120%,rgba(196,138,82,.35),transparent 70%);border-bottom:2px solid ' + cuivre + '">' +
      '<img src="' + CONFIG.logo + '" width="84" height="84" alt="La Photo Drômoise" style="display:block;margin:0 auto 12px;border:0">' +
      '<p style="margin:0;color:#fff;font-size:20px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Nouvelle demande de devis</p>' +
      '<p style="margin:8px 0 0;color:' + cuivre + ';font-size:14px;font-style:italic">' + esc(d["Type d'événement"] || 'Événement') +
        (d["Date de l'événement"] ? ' · ' + esc(d["Date de l'événement"]) : '') + (d['Lieu'] ? ' · ' + esc(d['Lieu']) : '') + '</p>' +
    '</td></tr>' +
    // Infos
    '<tr><td style="padding:22px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:' + carte + ';border:1px solid ' + ligne + ';border-radius:10px">' + lignes + '</table></td></tr>' +
    message +
    // Boutons
    '<tr><td style="padding:22px 22px 6px;text-align:center">' +
      bouton('mailto:' + esc(d['E-mail']) + '?subject=' + encodeURIComponent('Votre devis La Photo Drômoise'), 'Répondre au client', true) +
      (tel ? bouton('tel:' + tel, 'Appeler', false) : '') +
    '</td></tr>' +
    // Pied
    '<tr><td style="padding:18px 28px 26px;text-align:center;color:' + gris + ';font-size:12px;line-height:1.6">' +
      'Demande envoyée depuis la page « ' + esc(d['Envoyé depuis la page'] || 'Contact / Devis') + ' » du site ' +
      '<a href="' + CONFIG.site + '" style="color:' + cuivre + ';text-decoration:none">laphotodromoise.com</a><br>' +
      '<span style="color:' + cuivre + '">La Photo Drômoise</span> · Créateur et distributeur de sourires' +
    '</td></tr>' +
  '</table></div>';
}

function emailTexte_(d) {
  var t = 'Nouvelle demande de devis – La Photo Drômoise\n\n';
  CHAMPS.forEach(function (c) { if (d[c[0]]) t += c[1] + ' : ' + d[c[0]] + '\n'; });
  if (d['Message']) t += '\nMessage :\n' + d['Message'] + '\n';
  return t + '\nEnvoyé depuis laphotodromoise.com';
}

/* ---------- Tableau de suivi Google Sheets ---------- */
function enregistrer_(d) {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID'), ss;
  if (id) { ss = SpreadsheetApp.openById(id); }
  else { ss = SpreadsheetApp.create('Demandes de devis – La Photo Drômoise'); props.setProperty('SHEET_ID', ss.getId()); }
  var sh = ss.getSheets()[0];
  var entetes = ['Reçu le', 'Page'].concat(CHAMPS.map(function (c) { return c[1]; })).concat(['Message']);
  if (sh.getLastRow() === 0) {
    sh.appendRow(entetes);
    sh.getRange(1, 1, 1, entetes.length).setFontWeight('bold').setBackground('#c48a52').setFontColor('#140d06');
    sh.setFrozenRows(1);
  }
  sh.appendRow([new Date(), d['Envoyé depuis la page'] || ''].concat(CHAMPS.map(function (c) { return d[c[0]] || ''; })).concat([d['Message'] || '']));
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* Lancez cette fonction une fois depuis l'éditeur pour autoriser l'envoi et recevoir un e-mail de test. */
function testerEnvoi() {
  doPost({ parameter: {
    'Envoyé depuis la page': 'Contact / Devis', 'Nom & prénom': 'Julie Martin (TEST)', 'Téléphone': '06 12 34 56 78',
    'E-mail': CONFIG.destinataire, "Type d'événement": 'Mariage', "Date de l'événement": '12/06/2027',
    'Lieu': 'Domaine des Oliviers, Crest', "Nombre d'invités": '120', 'Formule souhaitée': 'Offre Confort (400 tirages)',
    'Options': "La valisette à accessoires, Livre d'or audio", 'Code société': '—', 'Nous a connus par': 'Réseaux sociaux',
    'Message': 'Bonjour ! Ceci est un e-mail de test du formulaire du site.'
  }});
}
