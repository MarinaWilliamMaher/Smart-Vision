const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
console.log(message);
const status = urlParams.get('status');
console.log(status);
const type = urlParams.get('type');
console.log(type);
const id = urlParams.get('id');
console.log(id);

const card = document.querySelector('.card');
const statusIcon = document.getElementById('statusIcon');
const statusMessage = document.getElementById('statusMessage');
const form = document.getElementById('form');
const formsend = document.querySelector('.send');
formsend.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formsend);
  formData.append('customerId', id);
  formData.delete('cPassword');
  const data = Object.fromEntries(formData);
  console.log(data);
  fetch('/customers/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      console.log(res);
      const message = 'Password successfully reset.';
      location.replace(
        `/customers/resetPassword?status=success&message=${message}`
      );
      alert('change successfully');
    })
    .catch((err) => {
      console.log(err);
    });
});

if (status === 'success' && type === 'reset') {
  form.classList.add('showBtn');
} else if (status === 'success') {
  statusIcon.innerHTML = '✔';
  statusMessage.textContent = message;
  card.classList.add('success');
  statusIcon.classList.add('success');
  statusMessage.classList.add('success');
  form.classList.add('hideBtn');
} else if (status === 'error') {
  statusIcon.innerHTML = '❌';
  statusMessage.textContent = message;
  card.classList.add('error');
  statusIcon.classList.add('error');
  statusMessage.classList.add('error');
  form.classList.add('hideBtn');
} else {
  statusIcon.innerHTML = '❓';
  statusMessage.textContent = message;
  card.classList.add('error');
  statusIcon.classList.add('error');
  statusMessage.classList.add('error');
  form.classList.add('hideBtn');
}
