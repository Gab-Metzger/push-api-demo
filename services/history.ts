import { Storage } from "@ionic/storage";
import { User } from "../interfaces/user";

const LOCK_DURATION_IN_MS: number = 60000;

class History {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  public async init() {
    await this.storage.create();
  }

  public async addUserToHistory(id: User["id"]): Promise<void> {
    await this.storage.set(String(id), new Date());
  }

  public async removeUserFromHistory(id: User["id"]): Promise<void> {
    await this.storage.remove(String(id));
  }

  public async canSendNotificationToUser(id: User["id"]): Promise<boolean> {
    try {
      const userInHistory: Date = await this.storage.get(id);
      if (userInHistory) {
        return Date.now() - userInHistory.getTime() > LOCK_DURATION_IN_MS;
      } else {
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}

export default new History();
