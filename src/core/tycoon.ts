export type CargoDestination = 'B' | 'Port' | 'A';

export class Sent {
  constructor(
    public readonly destination: CargoDestination,
    public readonly sentAt: number = 0
  ) {}

  returnTime(returnTime: number) {
    return this.sentAt + returnTime;
  }

  toString() {
    return `Sent cargo to warehouse ${this.destination}@${this.sentAt}`;
  }
}

export const SENT_TO_B = new Sent('B');
export const SENT_TO_PORT = new Sent('Port');

export class Tycoon {
  constructor(
    private nrOfTrucks: number = Infinity,
    private returnTimeFromB = 15,
    private returnTimeFromPort = 20
  ) {}

  transport(listOfDestinations: CargoDestination[], pastEvents: Sent[] = []) {
    if (!listOfDestinations.length) return [];
    const departureTime = pastEvents.length >= this.nrOfTrucks ? this.nextAvailable(pastEvents) : 0;
    return [new Sent(listOfDestinations.shift() as CargoDestination, departureTime)];
  }

  private nextAvailable(evts: Sent[]) {
    const [b1, b2] = evts.slice(-2);
    return Math.min(this.returnTime(b1), this.returnTime(b2));
  }

  returnTime(e: Sent) {
    let travelTime = 0;
    switch (e.destination) {
      case 'Port':
        travelTime = this.returnTimeFromPort;
        break;
      case 'B':
        travelTime = this.returnTimeFromB;
        break;
    }
    return e.returnTime(travelTime);
  }
}

export class Estimate {
  constructor(
    private distanceToB: number = 0,
    private distanceToPort: number = 0
  ) {}
  toArrival(p0: Sent[]) {
    return Math.max(
      0,
      ...p0.map((e) => {
        let travelTime = 0;
        switch (e.destination) {
          case 'Port':
            travelTime = this.distanceToPort;
            break;
          case 'B':
            travelTime = this.distanceToB;
            break;
        }
        return e.returnTime(travelTime);
      })
    );
  }

  listAfterDelivery(listOfDestinations: CargoDestination[], ev: Sent[]) {
    return listOfDestinations.slice(ev.length);
  }
}
