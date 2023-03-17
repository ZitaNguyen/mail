# Mail

Design a front-end for a single-page-app email client that makes API calls to get, send and update emails.

## Functionalities

### Maibox

When a user visits their Inbox, Sent mailbox, or Archive, an appropriate mailbox will be loaded by sending a `GET` request to `/emails/<mailbox>` for a particular maibox.

When a mailbox is visited, the application first query the API for the latest emails in that mailbox.

Each email will display who the email is from, what the subject line is, and the timestamp of the email.

If the email is unread, it appears with a white background. Otherwise, it has gray background.

### View Email

When a user clicks on an email, the user is taken to a view where they see the content of that email by making a `GET` request to `/emails/<email_id>`

The application will show the email’s sender, recipients, subject, timestamp, and body.

Once the email has been clicked on, the email is marked as read, and a `PUT` request is sent to `/emails/<email_id>` to update email status.


### Archive and Unarchive

When viewing an Inbox email, the user is presented with a button that lets them archive the email. When viewing an Archive email, the user is presented with a button that lets them unarchive the email. This is done by sending a `PUT` request to `/emails/<email_id>` to update email status.

Once an email has been archived or unarchived, load the user’s inbox.


### Reply

When viewing an email, the user is presented with a “Reply” button that lets them reply to the email.

When the user clicks the button, they are taken to the email composition form, which is pre-filled with
* recipient field set to whoever sent the original email
* subject line with the prefix `Re:` + original subject
* body beginning with for example `“On Jan 1 2020, 12:00 AM toto@example.com wrote:”` followed by the original text of the email.


### Send Mail

When a user submits the email composition form, Javascript code will send the email by making a `POST` request to `/emails`, passing in values for `recipients`, `subject`, and `body`.

Once the email has been sent, user’s sent mailbox will be loaded.
