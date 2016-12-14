# Medkumo Javascript SDK

Using this a SDK to book an appointment in Medkumo website.

### Javascript snippet
You should insert this snippet at the beginning of <body> tag.
```html
<body>
    <script src="//sdk.medkumo.com/medkumo.js"></script>
    ...
</body>
```

### Create a button to book an appointment
```html
<button onclick="Medkumo.book('your hospital key', 'your doctor key')">Booking An Appointment</button>
```

You can see full example in this file example-publisher.html.
