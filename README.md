

## Care and Share

Care & Share is a volunteer organisation dedicated to fostering a community-driven approach to healthcare, where compassion and support intersect to create lasting change. Our volunteer organization is founded on the belief that everyone deserves access to quality healthcare, regardless of their circumstances.

<div style="text-align:center;">
    <h4>Homepage</h4><br>
    <img src="./public/images/homepage-img.png">
</div>
<div style="text-align:center;">
    <h4>About Us</h4><br>
    <img src="./public/images/about-us.png">
</div>

## Features

There are 4 types of users in Care and Share:

1. Visitors (those who have not signed up/logged in)
2. Members
3. Branch managers
4. System admins

| Feature                    | Visitors             | Members        | Managers  | Admins |
| -------------------------- | -------------------- | -------------- | --------  |--------|
| Sign Up                    | ✅                   | ✅              | ✅        |✅      |
| Login                      | ✅                   | ✅              | ✅        |✅      |
| Logout                     | ❌                   | ✅              | ✅        |✅      |
| Google OAuth               | ❌                   | ✅              | ✅        |✅      |
| Change Password            | ❌                   | ✅              | ✅        |✅      |
| Announcements              | ❌                   | ✅              | ✅        |✅      |
| Search events              | ✅                   | ✅              | ✅        |✅      |
| View all branches          | ✅                   | ✅              | ✅        |✅      |
| View branch's details      | ✅                   | ✅              | ✅        |✅      |
| Join a branch              | ❌                   | ✅              | ❌        |❌      |
| Event RSVP                 | ❌                   | ✅              | ❌        |❌      |
| View branch members        | ❌                   | ❌              | ✅        |✅      |
| View RSVP for events       | ❌                   | ❌              | ✅        |✅      |
| Create new events          | ❌                   | ✅              | ✅        |✅      |
| Create new announcements   | ❌                   | ❌              | ✅        |❌      |
| View public events         | ✅                   | ✅              | ✅        |✅      |
| View private events        | ❌                   | ✅              | ✅        |✅      |
| Delete users               | ❌                   | ❌              | ❌        |✅      |
| Add users                  | ❌                   | ❌              | ❌        |✅      |
| Edit user's information    | ❌                   | ✅              | ✅        |✅      |
| Edit event's details       | ❌                   | ❌              | ✅        |✅      |
| Edit branch's details      | ❌                   | ❌              | ✅        |✅      |
| Email notification         | ❌                   | ✅              | ❌        |❌      |
| Create new branch          | ❌                   | ❌              | ❌        |✅      |
| Assign users as managers   | ❌                   | ❌              | ❌        |✅      |
| Sign up other admins       | ❌                   | ❌              | ❌        |✅      |



## Usage

To install all the npm Packages, run:
```
npm install
```

In order to have the latest database version for proper functioning, import it into MySQL. Please note that mysql must be running before hand `service mysql start`. Execute the following command:
```
mysql < db/CareAndShare.sql
```

Then you can run the project on localhost using the following command:
```
npm start
```
