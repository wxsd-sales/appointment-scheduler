<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch("onClick");
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
      id="common/icon/C/chevron-right-strong/24px"
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
        d="M14.667908,11.9121119 L6.06447031,3.31079064 C5.47861182,2.72507627 5.47849499,1.77532881 6.06420936,1.18947031 C6.64992373,0.60361182 7.59967119,0.603494986 8.18552969,1.18920936 L17.8393477,10.8406525 C18.4211249,11.4222866 18.4258843,12.363975 17.8500159,12.9514599 L8.19619787,22.8000167 C7.61628965,23.391623 6.66658953,23.4011061 6.07498328,22.8211979 C5.48337703,22.2412896 5.4738939,21.2915895 6.05380213,20.6999833 L14.667908,11.9121119 Z"
        id="chevron-right-strong"
        fill="#5A469B"
      ></path></g
    ></svg
  >
</div>
