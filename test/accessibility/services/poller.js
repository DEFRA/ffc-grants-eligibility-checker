export default class poller {
  static async pollWhileErrorThrownWithMessage(action, message, pollingLimit = 10) {
    let attempts = 0;

    do {
      attempts++;

      try {
        console.warn('POLLER: Calling action on attempt ' + attempts);
        await action();
        return;
      } catch (error) {
        console.warn('POLLER: Caught error ' + error.message);
        if (error.message !== message) {
          console.warn('POLLER: Throwing unexpected error');
          throw error;
        }

        if (attempts === pollingLimit) {
          console.warn('POLLER: Throwing expected error after limit reached');
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.warn('POLLER: Retrying after waiting');
        continue;
      }
    } while (true);
  }
}
