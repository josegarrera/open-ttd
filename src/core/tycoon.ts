export type Location = 'B' | 'Port' | 'A';
export type Destination = 'A' | 'B';

export class Sent {
  constructor(
    private readonly destination: Location,
    private readonly sentAt: number = 0,
    private readonly travelTime: number = 0
  ) {}

  returnTime() {
    return this.arrivalTime() + this.travelTime;
  }

  arrivalTime() {
    return this.sentAt + this.travelTime;
  }

  toString() {
    return `Sent cargo to warehouse ${this.destination}@${this.sentAt}`;
  }
}

export const SENT_TO_B = new Sent('B', 0, 1);
export const SENT_TO_PORT = new Sent('Port', 0, 3);

export class Tycoon {
  constructor(
    private nrOfTrucks: number = Infinity,
    private returnTimeFromB = 15,
    private returnTimeFromPort = 20
  ) {}

  transport(listOfDestinations: Location[], pastEvents: Sent[] = []) {
    if (!listOfDestinations.length) return [];
    const departureTime = pastEvents.length >= this.nrOfTrucks ? this.nextAvailable(pastEvents) : 0;
    const destination = listOfDestinations.shift() as Location;
    let travelTime = 0;
    switch (destination) {
      case 'Port':
        travelTime = this.returnTimeFromPort / 2;
        break;
      case 'B':
        travelTime = this.returnTimeFromB / 2;
        break;
    }
    return [new Sent(destination, departureTime, travelTime)];
  }

  private nextAvailable(evts: Sent[]) {
    const [b1, b2] = evts.slice(-2);
    return Math.min(b1.returnTime(), b2.returnTime());
  }
}

export class Estimate {
  constructor() {}
  toArrival(p0: Sent[]) {
    return Math.max(0, ...p0.map((e) => e.arrivalTime()));
  }

  listAfterDelivery(listOfDestinations: Location[], ev: Sent[]) {
    return listOfDestinations.slice(ev.length);
  }
}
