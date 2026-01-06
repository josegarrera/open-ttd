export type CargoDestination = 'B' | 'Port' | 'A';
type CargoStop = 'B' | 'Port' | 'A';

export interface DeliveryEvents {
  eq(e: DeliveryEvents): boolean;
  departure(): number;
  nextStop(): CargoStop | null;
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

  nextStop() {
    return null;
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

  nextStop() {
    return this.destination;
  }
}

export const SENT_TO_B = new Sent('B');
export const SENT_TO_PORT = new Sent('Port');
export const DONE = new Done();

export class Tycoon {
  constructor(
    private nrOfTrucks: number = Infinity,
    private returnTimeFromB = 15,
    private returnTimeFromPort = 20
  ) {}

  transport(listOfDestinations: CargoDestination[], pastEvents: DeliveryEvents[] = []) {
    if (!listOfDestinations.length) return [DONE];
    const departureTime = pastEvents.length >= this.nrOfTrucks ? this.nextAvailable(pastEvents) : 0;
    return [new Sent(listOfDestinations.shift() as CargoDestination, departureTime)];
  }

  private nextAvailable(evts: DeliveryEvents[]) {
    const [b1, b2] = evts.slice(-2);
    return Math.min(this.returnTime(b1), this.returnTime(b2));
  }

  private returnTime(e: DeliveryEvents) {
    switch (e.nextStop()) {
      case 'Port':
        return e.departure() + this.returnTimeFromPort;
      case 'B':
        return e.departure() + this.returnTimeFromB;
      default:
        return 0;
    }
  }
}

export class Estimate {
  constructor(
    private distanceToB: number = 0,
    private distanceToPort: number = 0
  ) {}
  toArrival(p0: DeliveryEvents[]) {
    return Math.max(
      0,
      ...p0.map((e) => {
        switch (e.nextStop()) {
          case 'B':
            return e.departure() + this.distanceToB;
          case 'Port':
            return e.departure() + this.distanceToPort;
          default:
            return 0;
        }
      })
    );
  }

  listAfterDelivery(listOfDestinations: CargoDestination[], ev: DeliveryEvents[]) {
    return listOfDestinations.slice(ev.length);
  }
}
