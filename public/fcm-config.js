import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BG5t51LWlghJOAbkclP68VNMCbtFdzHF3NVtBM2k2Kt0uf8uU3MEHx06xyWEDY2N6lXLIerm6-eVsL4J1NjPD_wY"
    });

    if (currentToken) {
      console.log('Token:', currentToken);
    } else {
      console.warn("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
};
