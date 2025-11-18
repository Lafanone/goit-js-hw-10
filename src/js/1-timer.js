import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css"

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css"

const dateTimePicker = document.querySelector("#datetime-picker")
const startBtn = document.querySelector("[data-start]")
const daysSpan = document.querySelector("[data-days]")
const hoursSpan = document.querySelector("[data-hours]")
const minutesSpan = document.querySelector("[data-minutes]")
const secondsSpan = document.querySelector("[data-seconds]")

let userSelectedDate = null
let timerInterval = null

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0]

        if (selectedDate <= new Date()) {
            iziToast.error({
                title: "Error",
                message: "Please choose a date in the future",
                position: "topRight",
            })
            startBtn.disabled = true 
        } else {
            userSelectedDate = selectedDate
            startBtn.disabled = false
        }
    }
}

flatpickr(dateTimePicker, options)

startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return
    startBtn.disabled = true
    dateTimePicker.disabled = true 

    timerInterval = setInterval(() => {
        const currentTime = new Date()
        const timeDiff = userSelectedDate - currentTime
        if (timeDiff <= 0) {
            clearInterval(timerInterval)
            updateTimerInterface(0, 0, 0, 0)
            dateTimePicker.disabled = false 
            return
        }
        const { days, hours, minutes, seconds } = convertMs(timeDiff)
        updateTimerInterface(days, hours, minutes, seconds)
    }, 1000)
})

function updateTimerInterface(days, hours, minutes, seconds) {
    daysSpan.textContent = addLeadingZero(days);
    hoursSpan.textContent = addLeadingZero(hours);
    minutesSpan.textContent = addLeadingZero(minutes);
    secondsSpan.textContent = addLeadingZero(seconds)
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0")
}

function convertMs(ms) {
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24

    const days = Math.floor(ms / day)
    const hours = Math.floor((ms % day) / hour)
    const minutes = Math.floor(((ms % day) % hour) / minute)
    const seconds = Math.floor((((ms % day) % hour) % minute) / second)

    return{days, hours, minutes, seconds}
}