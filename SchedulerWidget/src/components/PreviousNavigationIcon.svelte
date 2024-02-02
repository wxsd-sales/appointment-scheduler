<script>
  export let disabled = false;

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function onClick() {
    if (!disabled) dispatch("onClick");
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click={onClick}>
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    version="1.1"
    aria-hidden="true"
    role="img"
    focusable="false"
    ><g
      id="common/icon/C/chevron-left-strong/24px"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
      ><g id="consumer/icon-sizing/24px" opacity="0.01"
        ><rect id="canvas" fill="#FFBFF9" x="0" y="0" width="24" height="24"
        ></rect><rect
          id="art-area"
          fill="#FFFFFF"
          x="1"
          y="1"
          width="22"
          height="22"
        ></rect><g
          id="grid"
          stroke-width="1"
          transform="translate(0.000000, 1.000000)"
          stroke="#FF2AEC"
          ><rect
            id="vertical-rectangle"
            stroke-width="0.25"
            x="6.625"
            y="0.125"
            width="10.75"
            height="21.75"
            rx="2"
          ></rect><path
            d="M17.375,20 C17.375,20.517767 17.1651335,20.986517 16.8258252,21.3258252 C16.486517,21.6651335 16.017767,21.875 15.5,21.875 L8.5,21.875 C7.98223305,21.875 7.51348305,21.6651335 7.17417479,21.3258252 C6.83486652,20.986517 6.625,20.517767 6.625,20 L6.625,2 C6.625,1.48223305 6.83486652,1.01348305 7.17417479,0.674174785 C7.51348305,0.334866524 7.98223305,0.125 8.5,0.125 L15.5,0.125 C16.017767,0.125 16.486517,0.334866524 16.8258252,0.674174785 C17.1651335,1.01348305 17.375,1.48223305 17.375,2 L17.375,20 Z"
            id="horizontal-rectangle"
            stroke-width="0.25"
            transform="translate(12.000000, 11.000000) rotate(-270.000000) translate(-12.000000, -11.000000) "
          ></path><line
            x1="1"
            y1="11"
            x2="23"
            y2="11"
            id="vertical-center"
            stroke-width="0.3"
            stroke-linecap="square"
            stroke-dasharray="1"
            transform="translate(12.000000, 11.000000) rotate(-90.000000) translate(-12.000000, -11.000000) "
          ></line><line
            x1="0.978218914"
            y1="11"
            x2="22.9782189"
            y2="11"
            id="horizontal-center"
            stroke-width="0.3"
            stroke-linecap="square"
            stroke-dasharray="1"
            transform="translate(11.978219, 11.000000) rotate(-180.000000) translate(-11.978219, -11.000000) "
          ></line><line
            x1="-2.8492424"
            y1="11"
            x2="26.8492424"
            y2="11"
            id="diagonal"
            stroke-width="0.3"
            stroke-linecap="square"
            stroke-dasharray="1"
            transform="translate(12.000000, 11.000000) rotate(-135.000000) translate(-12.000000, -11.000000) "
          ></line><line
            x1="-2.8492424"
            y1="11"
            x2="26.8492424"
            y2="11"
            id="diagonal"
            stroke-width="0.3"
            stroke-linecap="square"
            stroke-dasharray="1"
            transform="translate(12.000000, 11.000000) rotate(-45.000000) translate(-12.000000, -11.000000) "
          ></line><circle
            id="circle"
            stroke-width="0.5"
            cx="12"
            cy="11"
            r="8.75"
          ></circle><circle
            id="inner-circle"
            stroke-width="0.5"
            cx="12"
            cy="11"
            r="5.25"
          ></circle><rect
            id="square"
            stroke-width="0.5"
            x="3.25"
            y="2.25"
            width="17.5"
            height="17.5"
            rx="2"
          ></rect></g
        ></g
      ><path
        d="M9.23590967,12.0878886 L17.8393474,20.6892098 C18.4252059,21.2749242 18.4253227,22.2246717 17.8396083,22.8105302 C17.253894,23.3963886 16.3041465,23.3965055 15.718288,22.8107911 L6.06446996,13.1593479 C5.4826928,12.5777139 5.47793343,11.6360254 6.05380178,11.0485406 L15.7076198,1.19998375 C16.287528,0.608377498 17.2372282,0.598894374 17.8288344,1.1788026 C18.4204407,1.75871082 18.4299238,2.70841094 17.8500156,3.30001719 L9.23590967,12.0878886 Z"
        id="chevron-left-strong"
        fill={disabled ? "#B5ADAD" : "#5A469B"}
      ></path></g
    ></svg
  >
</div>
