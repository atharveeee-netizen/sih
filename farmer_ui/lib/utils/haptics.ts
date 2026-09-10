export function triggerHapticFeedback(type: 'light' | 'medium' | 'success' | 'warning' | 'alert' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(30);
        break;
      case 'success':
        navigator.vibrate([20, 40, 20]);
        break;
      case 'warning':
        navigator.vibrate([40, 60, 40]);
        break;
      case 'alert':
        navigator.vibrate([60, 100, 60, 100, 60]);
        break;
    }
  } catch (err) {
    // Ignore unsupported vibration errors
  }
}
