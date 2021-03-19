# GeoFencing
A React Native app for [Mastek's Deep Blue hackathon](https://deepblue.co.in/).

This app is used to create a GeoFencing around a certain area.

<p align="center"><a href="https://drive.google.com/file/d/19P3E2Z0wyfItREbyR8Z9XXHUpwJ0yiRb/view?usp=sharing"><img src="https://i.ibb.co/jLbcdmL/splashscreen-image.png" alt="splashscreen-image" height="400" border="0"></a></p>

## Steps to create a GeoFence:
1. Create an admin account inside the app
2. Fill in Hospital details
3. Upload hospital floor map, routers information (Actual location, the channel in which they operate on, etc.)
4. Add [Reference Points](#reference-points) 
5. Add doctors to the hospital (An added doctor can log in with the same email).
6. Watch the location of the hardware device inside the region, and other data like pulse, battery level, etc. and get an alert when a breach happens!
7. Doctors can also log in after being added by an admin to see the features listed above.

## Hardware:
1. [Esp32](https://www.espressif.com/en/products/socs/esp32)
2. Li-ion 18650 battery for power
3. Pulse sensor for patient's heartbeat
4. SOS button to be pressed when a patient is in distress
5. LEDs to indicate battery level.

## Features:
1. Device's location with up to 2m accuracy
2. SOS alert inside the app
3. Strap disconnect alert (when a patient tries to remove this device)
4. Patient's pulse readings
5. Battery level of the device
6. Low cost (as compared to BLE beacons, RFID tags prices for a larger area)

## Algorithms used:
We followed the [Practical Fingerprinting Localization for Indoor Positioning System by Using Beacons by Santosh Subedi and Jae-Young Pyun](https://www.hindawi.com/journals/js/2017/9742170/) for getting the location of the device in a region.
This paper proposes the following algorithms to get an accurate position of the device:
1. Filters for reducing the fluctuations of signals produces by WiFi routers.
   - Gaussian Filter (used in the offline phase while taking reference points)
   - Moving Average filter (used in the offline phase while finding location)
2. Algorithms for estimating location:
   - Logarithmic Path Loss for finding distances from routers and assigning them a weight.
   - Weighted Centralized Localization (WCL) for the 1st estimation of location.
   - Weighted k-Nearest Neighbours (WkNN) selects the nearest 3 reference points assigns them weights and then use WCL again to get the final location.

## Tech Stack
1. App -
    1. React Native
    2. Redux
    3. Firebase
    4. React Native Paper, many other open source libraries!
    5. Expo (ejected)
2. Server -
    1. NodeJS
    2. WebSocket
    3. Firebase

<a name="reference-points"></a>
### Reference Point
- In the offline phase of the GeoFencing, the location and signal strengths received by each router at a reference point is stored inside the database.
- In the online phase these reference points are used to get an accurate estimation of location inside the region.
