import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

const container = document.createElement('div');
container.classList.add('input-container');
dateTimePicker.parentNode.insertBefore(container, dateTimePicker);

container.appendChild(dateTimePicker);
container.appendChild(startButton);

let userSelectedDate = null;
let countInterval = null;

startButton.disabled = true;

const addLeadingZero = value => String(value).padStart(2, '0');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

function timerUI({ days, hours, minutes, seconds }) {
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}
function timerStart() {
  if (!userSelectedDate) return;
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  countInterval = setInterval(() => {
    const currentTime = new Date();
    const differenceTime = userSelectedDate - currentTime;

    if (differenceTime <= 0) {
      clearInterval(countInterval);
      timerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.disabled = false;
      startButton.disabled = true;

      iziToast.success({
        title: 'Done',
        message: 'The countdown is over!',
        position: 'topRight',
        
      });
      return;
    }

    const componentsTime = convertMs(differenceTime);
    timerUI(componentsTime);
  }, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}
startButton.addEventListener('click', timerStart);
