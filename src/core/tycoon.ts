type CargoDestination = 'B';

interface DeliveryEvents {
  eq(e: DeliveryEvents): boolean;
  departure(): number;
}

export class Done implements DeliveryEvents {
  toString() {
    return `Work finished`;
  }

  eq(e: DeliveryEvents) {
    return this.toString() === e.toString();
  }

  departure() {
    return NaN;
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

  departure() {
    return this.sentAt;
  }
}

export const SENT_TO_B = new Sent('B');
export const DONE = new Done();

export class Tycoon {
  constructor(
    private nrOfTrucks: number = Infinity,
    private returnTimeFromB = 15
  ) {}

  transport(listOfDestinations: CargoDestination[], pastEvents: DeliveryEvents[] = []) {
    if (pastEvents.length >= this.nrOfTrucks) {
      return [new Sent('B', this.nextAvailable(pastEvents))];
    }
    if (listOfDestinations.length) return [SENT_TO_B];
    return [DONE];
  }

  private nextAvailable(evts: DeliveryEvents[]) {
    const [b1, b2] = evts.slice(-2);
    return Math.min(b1.departure(), b2.departure()) + this.returnTimeFromB;
  }
}

export class Estimate {
  constructor(private distanceToB: number = 0) {}
  toArrival(p0: DeliveryEvents[]) {
    let lastTime = Math.max(0, ...p0.map((e) => e.departure()).filter((t) => Number.isFinite(t)));
    let delivery = p0.map((e) => e.departure()).filter((t) => Number.isFinite(t)).length ? this.distanceToB : 0;
    return lastTime + delivery;
  }

  listAfterDelivery(listOfDestinations: CargoDestination[], ev: DeliveryEvents[]) {
    return listOfDestinations.slice(ev.length);
  }
}
