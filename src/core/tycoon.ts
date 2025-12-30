type CargoDestination = 'B';

export const SENT_TO_B = 'Sent cargo to warehouse B';
export const DONE = 'Work finished';

export class Tycoon {
  transport(listOfDestinations: CargoDestination[]) {
    if (listOfDestinations.length) return [SENT_TO_B];
    return [DONE];
  }
}

type DeliveryEvents = string;

export class Estimate {
  constructor(private distanceToB: number = 0) {}
  toArrival(p0: DeliveryEvents[]) {
    if (p0.length && p0[0].includes('B')) return this.distanceToB;
    return 0;
  }

  listAfterDelivery(listOfDestinations: CargoDestination[], ev: DeliveryEvents[]) {
    return listOfDestinations.slice(ev.length);
  }
}
