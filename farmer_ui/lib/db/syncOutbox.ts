import {
  getPendingCallbackRequests,
  removePendingCallbackRequest,
  getPendingActionLogs,
  removePendingActionLog,
} from './offlineStore';

export async function flushOutboxQueue(
  onSuccessCallback?: (msg: string) => void
): Promise<{ flushedCallbacks: number; flushedActions: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { flushedCallbacks: 0, flushedActions: 0 };
  }

  let flushedCallbacks = 0;
  let flushedActions = 0;

  // Flush callback requests
  const callbacks = await getPendingCallbackRequests();
  for (const cb of callbacks) {
    try {
      const res = await fetch('/api/callback-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cb),
      });
      if (res.ok) {
        await removePendingCallbackRequest(cb.id);
        flushedCallbacks++;
      }
    } catch (err) {
      console.warn('Failed to sync callback request:', err);
    }
  }

  // Flush action logs
  const actions = await getPendingActionLogs();
  for (const act of actions) {
    try {
      const res = await fetch(`/api/alerts/${act.riskType}/mark-done`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(act),
      });
      if (res.ok) {
        await removePendingActionLog(act.id);
        flushedActions++;
      }
    } catch (err) {
      console.warn('Failed to sync action log:', err);
    }
  }

  if ((flushedCallbacks > 0 || flushedActions > 0) && onSuccessCallback) {
    onSuccessCallback(`Synced ${flushedCallbacks + flushedActions} offline updates`);
  }

  return { flushedCallbacks, flushedActions };
}
