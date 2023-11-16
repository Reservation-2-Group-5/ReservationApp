<template>
  <Card class="card">
    <template #title>
      Welcome to Kennesaw State University's Reservation System
    </template>
    <template #content>
      <div class="outer">
        <div class="inner">
          <div class="header header-1">
            <h3 ref="head">
              Login to Access Inventory Reservations<wbr /><span class="nowrap"> and Room Bookings</span>
            </h3>
          </div>
          <div class="content">
            <p>
              Welcome to Kennesaw State University's Reservation System,
              your one-stop solution for reserving inventory devices and booking
              room or space time slots on our campus.
            </p>
            <p>
              This intuitive platform is designed to
              streamline the reservation process, making it convenient for you to manage your
              resource needs efficiently.
            </p>
          </div>
        </div>
        <hr />
        <div class="inner">
          <ul class="content">
            <li>
              Inventory Reservations:
              Browse and reserve a variety of inventory devices, from laptops to projectors,
              for your classes, workshops, or special events.
            </li>
            <li>
              Room/Space Bookings:
              Schedule conference rooms and offices on campus for lectures,
              meetings, or any other academic or administrative activities.
            </li>
            <li>
              User-Friendly Interface:
              Our intuitive interface ensures a seamless experience. Easily navigate through
              available devices and room time slots, and make reservations with just a few clicks.
            </li>
          </ul>
          <div class="header header-2">
            <h3>Key Features</h3>
          </div>
        </div>
        <hr />
        <div class="inner">
          <div class="header header-3">
            <h3>How to Get Started</h3>
          </div>
          <ol class="content">
            <li>
              Login:
              Click on the "<router-link to="/login">Login</router-link>" button to access your account. Use your university credentials
              to log in securely.
            </li>
            <li>
              Browse Inventory:
              Explore the available inventory devices and check their availability for your
              desired date and time.
            </li>
            <li>
              Book a Room/Space:
              Navigate to the room booking section to find and reserve a suitable space for your
              activities.
            </li>
          </ol>
        </div>
        <hr />
        <div class="inner">
          <div class="content">
            <p>
              If you encounter any issues or have questions, out support tram is ready to assist
              you. Reach out to support@kennesaw.edu for prompt assistance.
            </p>
            <p>
              Thank you for using the Example University Reservation System. We appreciate your
              commitment to efficient resource utilization and look forward to providing you with
              a seamless reservation experience.
            </p>
            <p>
              Best regards,<br />The KSU IT Team
            </p>
          </div>
          <div class="header header-4">
            <h3>Need Help?</h3>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
.card {
  height: 100%;
  --darken-bg: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}

a {
  color: #fff;
  text-decoration: underline;
}

a:hover {
  color: #ddd;
}

.outer {
  overflow-y: scroll;
  height: calc(100vh - 15rem);
  padding: 0 2rem;
}

.inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 4rem;
  grid-row-gap: 2rem;
  place-items: center;
  line-height: 1.8rem;
}

li {
  margin-bottom: 1rem;
  list-style-position: inside;
}

ol li {
  text-indent: -1.4rem;
  padding-left: 1.4rem;
}

ul li {
  text-indent: -1.7rem;
  padding-left: 1.7rem;
}

hr {
  border: 0;
  border-top: 1px solid #444;
  margin: 2rem 0;
}

.content {
  font-size: 1.2rem;
  padding: 0 2rem;
  font-family: 'Roboto', sans-serif;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  height: 100%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.inner>.content p:first-child {
  margin-top: 0;
}

.inner:last-child>.content p:last-child {
  align-self: flex-start;
}

.inner>.content li:last-child {
  margin-bottom: 0;
}

.inner:last-child>.content,
.inner:first-child>.content {
  padding: 1rem 2rem;
  text-align: left;
}

.header-1 {
  background: var(--darken-bg), url('KSUCCSEpic.jpg') no-repeat center center;
}

.header-2 {
  background: var(--darken-bg), url('atrium-building.jpg') no-repeat center center;
}

.header-3 {
  background: var(--darken-bg), url('Norton.jpg') no-repeat center center;
}

.header-4 {
  background: var(--darken-bg), url('marietta-campus-globe.jpg') no-repeat center center;
}

.header {
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.inner h3 {
  color: #fff;
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  padding: 2rem;
  text-align: center;
  text-shadow: 4px 3px 7px #7A7A7A;
  margin-bottom: 3rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  line-height: 1.3;
}

.nowrap {
  white-space: nowrap;
}

@media (max-width: 1020px) {
  .nowrap {
    white-space: normal;
  }
}
</style>
