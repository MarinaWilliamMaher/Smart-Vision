const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('message');
console.log(message);
const status = urlParams.get('status');
console.log(status);

const card = document.querySelector('.card');
const statusIcon = document.getElementById('statusIcon'); // Corrected
const statusMessage = document.getElementById('statusMessage'); // Corrected
const btn = document.getElementById('btn'); // Corrected

if (status === 'success') {
  statusIcon.innerHTML = '✔';
  statusMessage.textContent = message;
  card.classList.add('success');
  statusIcon.classList.add('success');
  statusMessage.classList.add('success');
  btn.classList.add('showBtn');
} else if (status === 'error') {
  statusIcon.innerHTML = '❌';
  statusMessage.textContent = message;
  card.classList.add('error');
  statusIcon.classList.add('error');
  statusMessage.classList.add('error');
  btn.classList.add('hideBtn'); // Corrected
} else {
  statusIcon.innerHTML = '❓';
  statusMessage.textContent = message;
  card.classList.add('error');
  statusIcon.classList.add('error');
  statusMessage.classList.add('error');
  btn.classList.add('hideBtn');
}
