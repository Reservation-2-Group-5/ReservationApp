<template>
    <Card class="card">
        <template #title>
            Welcome to the CCSE Reservation Application
        </template>
        <template #content>
            <div class="block">
                <img src='KSUCCSEpic.jpg' alt="KSU Picture" />
                <p> Kennesaw State University's College of Computing and Software Engineering is one of the best in the country, with each of its degree programs being recognized nationally. We offer both undergraduate and graduate degrees in Computer Science, Information Technology, Software Engineering and Computer Game Design and Development.</p>
            </div>
        </template>
    </Card>
</template>
<script setup>
    import Card from 'primevue/card'
</script>
<style scoped>
    .card {
        height: 100%;
    }
    .block{
        display:flex;
        gap:50px;
    }
</style>