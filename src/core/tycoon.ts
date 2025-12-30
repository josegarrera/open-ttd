type CargoDestination = 'B';

export class Tycoon {
  transport(listOfDestinations: CargoDestination[]) {
    if (listOfDestinations.length) return ['Send cargo to warehouse B'];
    return ['No need to travel'];
  }
}
export class Estimate {
  toArrival() {
    return 0;
  }
}
