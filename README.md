# Appointment Scheduler

Welcome to our WXSD DEMO Repo! <!-- Keep this here -->

Appointment Scheduler widget is a standalone widget that can be embedded inside any HTML file or as an iframe. I have built a webpage using the this widget which takes the date and time of appointment wanted from the widget and schedules an appointment.

<img width="613" alt="image" src="https://github.com/wxsd-sales/appointment-scheduler/assets/85897512/44b72cfe-c844-49be-b627-a656351553a4">


## Table of Contents

<!-- ⛔️ MD-MAGIC-EXAMPLE:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>(click to expand)</summary>
  * [Usage](#usage)
  * [Setup](#setup)
  * [Installation](#installation)
  * [License](#license)  
  * [Disclaimer](#disclaimer)
  * [Questions](#questions)

</details>
<!-- ⛔️ MD-MAGIC-EXAMPLE:END -->
 
## Usage

You can use the appointment scheduler widget like:

```
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your HTML Page</title>

  <!-- Include the external CSS file -->
  <link rel="stylesheet" href="AppointmentWidget.css" />
</head>

<body>
  <div id="mywidget"></div>

  <script src="https://socketeer.glitch.me/SchedulerWidget.js"></script>
  <script>
    const widget = new SchedulerWidget({
      target: document.getElementById("mywidget"),
      props: {
        notifyChanges: (formData) => {
          console.log("Updated form data", formData);
        },
      },
    });

    console.log("widget data", widget.getFormData());
  </script>
</body>
```

## Setup

### For Scheduler Widget Test

1. You will need to create a file called **.env** that includes the following lines:

```
PUBLIC_COMPANY_NAME=
PUBLIC_COMPANY_URL=

```

Note:
PUBLIC_COMPANY_NAME is the name of the company you would like to demo this widget to
PUBLIC_COMPANY_URL is the URL explaining company's privacy polcies

2. You will also have to replace your company icon in the schedulerWidgetTest/static/favicon.png file
3. You will have to replace the company logo in the schedulerWidgetTest/static/company-logo.png file
Follow steps 2 and 3 for better branding

## Installation

### For Scheduler Widget Test

The typical install flow, after cloning this repo

```
npm install
npm run dev
```

## License

<!-- MAKE SURE an MIT license is included in your Repository. If another license is needed, verify with management. This is for legal reasons.-->

<!-- Keep the following statement -->

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.

## Disclaimer

<!-- Keep the following here -->

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex usecases, but are not Official Cisco Webex Branded demos.

## Questions

Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=war-room-assistant-bot) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team.
