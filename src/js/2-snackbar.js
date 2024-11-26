import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formWrapper = document.querySelector('.form');

formWrapper.addEventListener('submit', event => {
  event.preventDefault();

  const form = event.target;
  const delay = parseInt(form.delay.value, 10);
  const state = form.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        timeout: 3000,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        timeout: 3000,
      });
    });
});