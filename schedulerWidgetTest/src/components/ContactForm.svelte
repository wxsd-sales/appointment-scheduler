<script>
  import { createEventDispatcher, afterUpdate } from "svelte";
  import { PUBLIC_COMPANY_NAME, PUBLIC_COMPANY_URL  } from "$env/static/public";
  import Button from "./Button.svelte";
  import Input from "./Input.svelte";
  import {env} from "$env/dynamic/public";

  export let formData = {};

  let disabled = false;

  const dispatch = createEventDispatcher();

  let isChecked = true;

  function handleCheckboxChange() {
    const checked = isChecked;
    console.log(isChecked)

    saveFormData({ checked });
    // isChecked = !isChecked;
  }

  // @ts-ignore
  function updateFirstName(event) {
    // @ts-ignore
    const firstName = event.detail;

    saveFormData({ firstName });
  }

  // @ts-ignore
  function updateLastName(event) {
    // @ts-ignore
    const lastName = event.detail;

    saveFormData({ lastName });
  }

  // @ts-ignore
  function updateEmail(event) {
    // @ts-ignore
    const email = event.detail;

    saveFormData({ email });
  }

  function updatePhone(event) {
    // @ts-ignore
    const phone = event.detail;

    saveFormData({ phone });
  }

  function updateExtension(event) {
    // @ts-ignore
    const extension = event.detail;

    saveFormData({ extension });
  }

  function updatePhoneType(event) {
    // @ts-ignore
    const phoneType = event.detail;

    saveFormData({ phoneType });
  }

  // @ts-ignore
  function saveFormData(data) {
    dispatch("save", data);
  }

  function previousStep() {
    dispatch("previous");
  }

  function submitData() {
    dispatch("submit");
  }

  function setIsDisabledSubmitButton() {
    // @ts-ignore
    disabled = !formData.firstName || !formData.lastName || !formData.email;
  }

  afterUpdate(() => {
    setIsDisabledSubmitButton();
  });
</script>

<div class="container">
  <h2><b>Your contact information</b></h2>
  <br/>

  <Input
    type="text"
    name="firstName"
    placeholder="First name"
    required
    on:onChange={updateFirstName}
  />

  <Input
    type="text"
    name="lastName"
    placeholder="Last name"
    required
    on:onChange={updateLastName}
  />

  <Input
    type="email"
    name="email"
    placeholder="Email Address"
    required
    on:onChange={updateEmail}
  />

  <Input
    type="phone"
    name="phone"
    placeholder="Phone Number"
    required
    on:onChange={updatePhone}
  />

  <Input
    type="extension"
    name="extension"
    placeholder="Extension"
    required
    on:onChange={updateExtension}
  />

  <select on:change={updatePhoneType} required>
    <option>Phone Type</option>
    <option>Mobile</option>
    <option>Home</option>
    <option>Office</option>
  </select>

  <br/>
  <h3><b>A banker may call you at the phone number provided to confirm or discuss your appointment.</b></h3>

  <label>
    <input type="checkbox" bind:checked={isChecked} on:change={handleCheckboxChange} />
    Check this box to receive SMS text messages regarding your {env.PUBLIC_COMPANY_NAME} appointment. Message frequency varies. Message and data rates may apply. Text STOP to opt out or HELP for help.
  </label>

  <div>See our policy here <a href={env.PUBLIC_COMPANY_URL} rel="noopener noreferrer" target="_blank">{env.PUBLIC_COMPANY_NAME} privacy and security - Privacy policies</a></div>

  <br/>
  <div class="buttons-container">
    <Button label="Previous" on:onClick={previousStep} />
    <Button label="Submit" {disabled} on:onClick={submitData} />
  </div>
</div>

<style>
  .container {
    display: flex;
    padding: 2rem;
    flex-direction: column;
  }

  h3 {
    display: flex;
    margin-bottom: 1rem;
  }

  .buttons-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  select {
    width: 90%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
  }
  
</style>
