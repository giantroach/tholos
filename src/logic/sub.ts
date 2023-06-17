import {
  BgaNotification,
} from "../type/bga-interface.d";

//
// Sub handles BGA notifications and apply data accordingly.
//

export class Sub {
  constructor(
    public playerID: number, // public for testing purpose
  ) {}

  public handle(notif: BgaNotification) {
    switch (notif.name) {
      default:
        break;
    }
  }
}
