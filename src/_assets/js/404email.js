function makeNotice() {
  const url = window.location.href;
  const referer = document.referrer;

  sendEmail("404", "meinamsterdam@blog.re", "\n404 not found on: \n" + url + "\n\n and referer = \n" + referer);
}

function sendEmail(name, email, message) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
    };

    var feedback;
    fetch("/api/envoi.php", options)
    .then(response => response.json())
    .then(data => {
        if (data.status === 201) {
          feedback="📨 message envoyé. 😘 Merci !";
        } else {
          feedback="⚠️ Problème: message non envoyé :(";
        }
    })
    .catch(error => console.error("error sendEmail", error))
}