<template>
    <div class="post">
        <div v-if="loading" class="loading">
            Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationvue">https://aka.ms/jspsintegrationvue</a> for more details.
        </div>

        <div v-if="post" class="content">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="forecast in post" :key="forecast.date">
                        <td>{{ forecast.date }}</td>
                        <td>{{ forecast.temperatureC }}</td>
                        <td>{{ forecast.temperatureF }}</td>
                        <td>{{ forecast.summary }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="js">
    import { onMounted, watch, ref } from 'vue';
    const post = ref(null);
    const loading = ref(false);

    async function fetchData() {
        post.value = null;
        loading.value = true;
        try {
            const response = await fetch('weatherforecast');
            const json = await response.json();
            post.value = json;
            loading.value = false;
        } catch (err) {
            console.error(err);
        }
        return;
    }

    // fetch the data when the view is created and the data is
    // already being observed
    onMounted(fetchData);
</script>