<template>
    <div class="page">
        <h3>{{ connected ? 'Connected!' : 'Not Connected' }}</h3>
        <p><strong>Active Scene:</strong> {{ active }}</p>
        <p><strong>All Scenes:</strong></p>
        <ul>
            <li :key="i" v-for="(name, i) in scenes">{{ name }}</li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
    import type { PromiseType } from 'utility-types';
    import { onMounted, ref } from 'vue';
    import { xjs, Subscription } from '@/../..';

    const connected = ref(false);
    const scenes = ref<any[]>([]);
    const active = ref('Unknown');

    let client!: PromiseType<ReturnType<typeof xjs>>;

    onMounted(async () => {
        client = await xjs();
        connected.value = true;

        // Process the initial Scenes.
        const allScenes = await client.getAllScenes();
        process(allScenes as any[]);

        // Listen to when Scenes change.
        client.events.on(Subscription.ScenesList, (data: any) => process(data));
        client.subscribe(Subscription.ScenesList);

        // Set the initial active Scene.
        active.value = (await client.getActiveScene() as any).name;

        // Set the active Scene whenever it changes.
        client.events.on(Subscription.SceneChange, ({ name }: any) => {
            active.value = name;
        });
        client.subscribe(Subscription.SceneChange);
    });

    const process = (all: any[]) => {
        scenes.value = [];

        const total = all.length;

        for (let i = 0; i < total; i++) {
            const scene = all[i];

            scenes.value = [
                ...scenes.value,
                scene.name,
            ];
        }
    };
</script>

<style>
    html,
    body,
    #app {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .page {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 20px;
    }
</style>
