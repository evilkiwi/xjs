import { Event } from '@/enums';
import type { Options } from './types';

export const methods = ({ request }: Options) => ({
    getActiveScene: async () => request({
        event: Event.GetActiveScene,
    }),
    setActiveScene: async ({ id }: any) => request({
        event: Event.SetActiveScene,
        payload: { id },
    }),
    getAllScenes: async () => request({
        event: Event.GetAllScenes,
    }),
    getSceneSources: async (sceneId: string) => request({
        event: Event.GetSceneSources,
        payload: { sceneId },
    }),
    getSourceState: async (payload: any) => request({
        event: Event.GetSourceState,
        payload,
    }),
    setSourceState: async (payload: any) => request({
        event: Event.SetSourceState,
        payload,
    }),
    toggleSourceState: async (payload: any) => request({
        event: Event.ToggleSourceState,
        payload,
    }),
    getScenePresets: async (sceneId: string) => request({
        event: Event.GetScenePresets,
        payload: { sceneId },
    }),
    getActivePreset: async (sceneId: string) => request({
        event: Event.GetActivePreset,
        payload: { sceneId },
    }),
    setActivePreset: async (payload: any) => request({
        event: Event.SetActivePreset,
        payload,
    }),
    getAllOutputs: async () => request({
        event: Event.GetOutputList,
    }),
    getOutputState: async (payload: any) => request({
        event: Event.GetOutputState,
        payload,
    }),
    toggleOutputState: async (payload: any) => request({
        event: Event.ToggleOutputState,
        payload,
    }),
    setOutputState: async (payload: any) => request({
        event: Event.SetOutputState,
        payload,
    }),
    doScreenshot: async () => request({
        event: Event.DoScreenshot,
    }),
    doPushToLive: async () => request({
        event: Event.PushToLive,
    }),
    toggleMicrophoneState: async () => request({
        event: Event.ToggleMicrophoneState,
    }),
    getMicrophoneState: async () => request({
        event: Event.GetMicrophoneState,
    }),
    setMicrophoneState: async (payload: any) => request({
        event: Event.SetMicrophoneState,
        payload,
    }),
    setPushToTalk: async (state: any) => request({
        event: Event.SetPushToTalk,
        payload: { state },
    }),
    toggleSpeakerState: async () => request({
        event: Event.ToggleSpeakerState,
    }),
    getSpeakerState: async () => request({
        event: Event.GetSpeakerState,
    }),
    setSpeakerState: async (payload: any) => request({
        event: Event.SetSpeakerState,
        payload,
    }),
    ping: async () => request({
        event: Event.Ping,
    }),
});
