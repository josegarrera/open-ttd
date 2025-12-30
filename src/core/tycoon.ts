type CargoDestination = 'B';

interface DeliveryEvents {
  eq(e: DeliveryEvents): boolean;
}

export class Done implements DeliveryEvents {
  toString() {
    return `Work finished`;
  }

  eq(e: DeliveryEvents) {
    return this.toString() === e.toString();
  }
}

export class Sent implements DeliveryEvents {
  constructor(
    private destination: CargoDestination,
    private sentAt: number = 0
  ) {}

  toString() {
    return `Sent cargo to warehouse ${this.destination}@${this.sentAt}`;
  }

  eq(e: DeliveryEvents) {
    return this.toString() === e.toString();
  }
}

export const SENT_TO_B = new Sent('B');
export const DONE = new Done();

export class Tycoon {
  constructor(private nrOfTrucks: number = Infinity) {}

  transport(listOfDestinations: CargoDestination[], pastEvents: DeliveryEvents[] = []) {
    if (pastEvents.length >= this.nrOfTrucks) return [new Sent('B', 15)];
    if (listOfDestinations.length) return [SENT_TO_B];
    return [DONE];
  }
}

export class Estimate {
  constructor(private distanceToB: number = 0) {}
  toArrival(p0: DeliveryEvents[]) {
    if (p0.length && p0[0].eq(SENT_TO_B)) return this.distanceToB;
    return 0;
  }

  listAfterDelivery(listOfDestinations: CargoDestination[], ev: DeliveryEvents[]) {
    return listOfDestinations.slice(ev.length);
  }
}
