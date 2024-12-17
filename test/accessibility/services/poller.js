export default class poller {
  static async pollWhileErrorThrownWithMessage(action, message, pollingLimit = 10) {
    let attempts = 0;

    do {
      attempts++;

      try {
        await action();
        return;
      } catch (error) {
        if (error.message !== message) {
          throw error;
        }

        if (attempts === pollingLimit) {
          throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
    } while (true);
  }
}
