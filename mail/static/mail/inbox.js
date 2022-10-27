document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#display-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Write and send email, then return to Sent mailbox
  document.querySelector('#compose-form').addEventListener('submit', event => {
    event.preventDefault();
    send_email();
  });
}

function send_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => load_mailbox('sent'));
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Load all emails
	fetch(`/emails/${mailbox}`)
	.then(response => response.json())
	.then(emails => {
		emails.forEach(email => {
			let email_preview = document.createElement('div');
      email_preview.setAttribute('class', 'box')
			email_preview.innerHTML = `
				<div class="d-flex justify-content-between mx-3">
					<p><strong>${email['sender']}</strong><span class="ml-3">${email['subject']}</span></p>
					<p>${email['timestamp']}</p>
				</div>
			`;
			document.querySelector('#emails-view').append(email_preview);
      // Email background
			if (email['read'] === false) {
				email_preview.style.backgroundColor = '#ffffff';
			} else {
				email_preview.style.backgroundColor = ' #ebedef';
			}
      // Load email content
			email_preview.addEventListener('click', event => {
				event.preventDefault();
				load_email(email, mailbox);
			});
		})
	})
}

function load_email(email, mailbox) {
  // Show email content and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#compose-view').style.display = 'none';
	document.querySelector('#display-email-view').style.display = 'block';

	// Load email
	let email_content = document.createElement('div');
	email_content.innerHTML = `
		<p><strong>From</strong>: ${email['sender']}</p>
		<p><strong>To</strong>: ${email['recipients']}</p>
		<p><strong>Subject</strong>: ${email['subject']}</p>
		<p><strong>Timestamp</strong>: ${email['timestamp']}</p>
		<hr>
		<p>${email['body']}</p>
	`;
	document.querySelector('#display-email-view').innerHTML = '';
	document.querySelector('#display-email-view').append(email_content);

  // Mark email as read
	fetch(`/emails/${email['id']}`, {
		method: 'PUT',
		body: JSON.stringify({
			read: true
		})
	})

  if (mailbox != 'sent') {
		// Create button Archive or Unarchive
		let button_archive = document.createElement('button');
		button_archive.innerHTML = (email['archived'] == false) ? 'Archive' : 'Unarchive';
		email_content.appendChild(button_archive);
		button_archive.addEventListener('click', event => {
			event.preventDefault();
			// toogle email archived
			fetch(`/emails/${email['id']}`, {
				method: 'PUT',
				body: JSON.stringify({
					archived : !email['archived']
				})
			})
			.then(response => load_mailbox('inbox'));
		});
  }
}