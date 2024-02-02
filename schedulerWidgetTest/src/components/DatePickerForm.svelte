<script>
  // @ts-nocheck

  import { createEventDispatcher, onMount, afterUpdate } from "svelte";

  import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.min.css";
  import "flatpickr/dist/themes/dark.css";

  import "bulma/css/bulma.css";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import PreviousNavigationIcon from "./PreviousNavigationIcon.svelte";
  import NextNavigationIcon from "./NextNavigationIcon.svelte";

  const showBusinessDays = 3;

  let date = new Date();
  export let formData = {};

  let startingSlotDate = new Date();
  let disabled = true;
  /**
   * @type {any[]}
   */
  let businessDays = [];
  let previousNavigationDisabled = true;

  // @ts-ignore
  let { selectedTimeOfDay, selectedSlotTime, selectedSlotDate, calendarDate } =
    formData;

  const dispatch = createEventDispatcher();

  afterUpdate(() => {
    setIsDisabledNextButton();
  });

  /**
   * @ts-ignore
   * @type {any[]}
   */
  let timeSlots = [];

  onMount(() => {
    updateTimeSlots();
    updateBusinessDays();
  });

  // @ts-ignore
  function saveSlotDateAndTime(selectedSlotDate, selectedSlotTime) {
    console.log("formData", formData);

    saveFormData({ selectedSlotTime });
    saveFormData({ selectedSlotDate });
  }

  // @ts-ignore
  function isSlotChecked(slotDate, slotTime) {
    return selectedSlotTime === slotTime && selectedSlotDate === slotDate;
  }

  // @ts-ignore
  function generateTimeSlots(startHour, endHour, intervalMinutes) {
    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
        const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
        timeSlots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return timeSlots;
  }

  // @ts-ignore
  function saveFormData(data) {
    dispatch("save", data);
    setIsDisabledNextButton();
  }

  function updateTimeSlots() {
    if (selectedTimeOfDay === "morning") {
      timeSlots = generateTimeSlots(9, 11, 30);
    } else if (selectedTimeOfDay === "afternoon") {
      timeSlots = generateTimeSlots(12, 16, 30);
    }
  }

  function updateBusinessDays() {
    businessDays = getNextBusinessDays();
  }

  // @ts-ignore
  function isOffDay(date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  function getNextBusinessDays() {
    const result = [];
    let currentDate = new Date(startingSlotDate);

    if (currentDate > new Date() && !isOffDay(currentDate)) {
      result.push(new Date(currentDate));
    }
    while (result.length < showBusinessDays) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (!isOffDay(currentDate)) {
        //   // Exclude Saturday and Sunday
        result.push(new Date(currentDate));
      }
    }
    return result;
  }

  function isStartingDateIsCurrentDate() {
    return startingSlotDate.toDateString() === new Date().toDateString();
  }

  function updatePreviousNavigationDisabledStatus() {
    previousNavigationDisabled =
      isStartingDateIsCurrentDate() || startingSlotDate < new Date();
  }

  function goToPreviousBusinessDays() {
    let disableNavigation = isStartingDateIsCurrentDate();
    if (disableNavigation) return;

    let currentDate = new Date(startingSlotDate);
    let index = 0;

    while (index < showBusinessDays) {
      currentDate.setDate(currentDate.getDate() - 1);

      if (!isOffDay(currentDate)) {
        index++;
      }
    }

    startingSlotDate = new Date(currentDate);

    updatePreviousNavigationDisabledStatus();

    updateBusinessDays();
  }

  function goToNextBusinessDays() {
    let currentDate = new Date(startingSlotDate);
    let index = 0;

    while (index < showBusinessDays) {
      currentDate.setDate(currentDate.getDate() + 1);

      if (!isOffDay(currentDate)) {
        index++;
      }
    }

    startingSlotDate = new Date(currentDate);
    previousNavigationDisabled = false;

    updateBusinessDays();
  }

  // @ts-ignore
  function getFormattedDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    }).format(date);
  }

  onMount(() => {
    flatpickr("#datePicker", {
      enableTime: false,
      dateFormat: "m/d/Y",
      minDate: "today",
      // @ts-ignore
      defaultDate: calendarDate || date,
      onChange: (selectedDates) => {
        date = selectedDates[0];

        startingSlotDate = date;

        saveFormData({ calendarDate: selectedDates[0] });
        updateBusinessDays();

        updatePreviousNavigationDisabledStatus();
      },
    });
  });

  function nextStep() {
    dispatch("next");
  }

  function setIsDisabledNextButton() {
    //@ts-ignore
    let {
      selectedTimeOfDay: timeOfDay,
      selectedSlotTime: slotTime,
      selectedSlotDate: slotDate,
      calendarDate: date,
    } = formData;

    disabled = !timeOfDay || !slotTime || !slotDate || !date;
  }
</script>

<div class="container">
  <h1>Choose a day and time</h1>
  <div class="address_date_container">
    <div class="date-container">
      <Input name="datePicker" placeholder="Select date..." required readonly />
    </div>
    <div class="address-container">
      <div class="address">Westlake Crossing</div>
      <div>10305 Westlake Dr,</div>
      <div>Bethesda, MD, 20817</div>
      <div>Phone: 301-365-4700</div>
    </div>
  </div>

  <div class="time-of-day-container">
    <h3 class="time-of-day-container">Time of day</h3>
    <div class="radios-container">
      <label>
        <input
          type="radio"
          bind:group={selectedTimeOfDay}
          value="morning"
          on:change={updateTimeSlots}
        />
        Morning
      </label>
      <label>
        <input
          type="radio"
          bind:group={selectedTimeOfDay}
          value="afternoon"
          on:change={updateTimeSlots}
        />
        Afternoon
      </label>
    </div>
  </div>

  <div class="slots-container">
    <PreviousNavigationIcon
      disabled={previousNavigationDisabled}
      on:onClick={goToPreviousBusinessDays}
    />

    {#each businessDays as businessDay (businessDay)}
      <div class="day-slots-container">
        <div>{getFormattedDate(businessDay)}</div>
        {#each timeSlots as slot (slot)}
          <div>
            <input
              type="radio"
              on:change={() => saveSlotDateAndTime(businessDay, slot)}
              checked={isSlotChecked(businessDay, slot)}
              value={slot}
            />
            {slot}
          </div>
        {/each}
      </div>
    {/each}

    <NextNavigationIcon on:onClick={goToNextBusinessDays} />
  </div>

  <div class="buttons-container">
    <Button label="Next" {disabled} on:onClick={nextStep} />
  </div>
</div>

<style>
  .container {
    display: flex;
    padding: 2rem;
    flex-direction: column;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
  }

  .address_date_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1rem 1rem 0;
  }
  .address-container {
    margin: 20px 0px;
  }

  .address {
    font-weight: 600;
    font-size: bold;
  }

  .buttons-container {
    display: flex;
    align-items: center;
    margin: 0 auto;
  }

  .radios-container {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 1rem;
  }

  .time-of-day-container {
    margin-bottom: 1rem;
  }

  .slots-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .day-slots-container {
    display: flex;
    gap: 20px;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .address_date_container {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }
</style>
