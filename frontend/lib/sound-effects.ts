/**
 * Utility for playing UI sounds
 */

const NOTIFICATION_SOUND_URL = "/notification.mp3"; // Ding sound for notifications
const MESSAGE_SOUND_URL = "/message.mp3"; // Sound for AI messages
const SEND_SUCCESS_SOUND_URL = "/send-success.mp3"; // User's custom send success sound
const RECEIVED_SOUND_URL = "/received.mp3"; // Sound for received payment requests
const REQUEST_SUCCESS_URL = "/request-success.mp3"; // User's custom request success sound
const REJECTED_SOUND_URL = "/rejected.mp3"; // User's custom rejected sound

export const playSound = (type: 'notification' | 'message' | 'received' | 'success' | 'request_success' | 'rejected') => {
    try {
        let url = "";
        switch (type) {
            case 'success': url = SEND_SUCCESS_SOUND_URL; break;
            case 'message': url = MESSAGE_SOUND_URL; break;
            case 'notification': url = NOTIFICATION_SOUND_URL; break;
            case 'received': url = RECEIVED_SOUND_URL; break;
            case 'request_success': url = REQUEST_SUCCESS_URL; break;
            case 'rejected': url = REJECTED_SOUND_URL; break;
        }
        const audio = new Audio(url);
        audio.volume = 1.0;
        audio.play().catch(error => {
            console.warn("Sound playback failed (likely browser policy):", error);
        });
    } catch (error) {
        console.error("Error playing sound:", error);
    }
};
