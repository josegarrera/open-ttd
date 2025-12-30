type CargoDestination = 'B';

export class Tycoon {
  transport(listOfDestinations: CargoDestination[]) {
    if (listOfDestinations.length) return ['Sent cargo to warehouse B'];
    return ['Work finished'];
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
