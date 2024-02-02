<script>
  // @ts-nocheck
  import Button from "./Button.svelte";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let isWidgetLoaded = false;
  let disabled = true;

  let widget = null;

  onMount(() => {
    isWidgetLoaded = true;
    console.log("Widget is loaded");
    widget = new SchedulerWidget({
      target: document.getElementById("mywidget"),
      props: {
        notifyChanges: updateWidgetData,
      },
    });

    console.log(" widget.getFormData()", widget.getFormData());
  });

  function updateWidgetData(widgetData) {
    console.log("widgetData", widgetData);
    setIsDisabledNextButton();
  }

  function nextStep() {
    const widgetData = widget ? widget.getFormData() : {};

    dispatch("save", widgetData);
    dispatch("next");
  }

  function setIsDisabledNextButton() {
    if (!widget || !isWidgetLoaded) {
      return;
    }

    console.log(" widget.getFormData()", widget.getFormData());

    const formData = widget.getFormData();
    let {
      selectedTimeOfDay: timeOfDay,
      selectedSlotTime: slotTime,
      selectedSlotDate: slotDate,
      calendarDate: date,
    } = formData;

    disabled = !timeOfDay || !slotTime || !slotDate || !date;
  }
</script>

<svelte:head>
  <script src="https://flaxen-dear-hallway.glitch.me/SchedulerWidget.js"></script>
</svelte:head>

<div id="mywidget"></div>
<div class="buttons-container1">
  <Button label="Next" {disabled} on:onClick={nextStep} />
</div>

<style>
  .buttons-container1 {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 2%;
  }
</style>
