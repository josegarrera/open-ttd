type CargoDestination = 'B';

export class Tycoon {
  transport(listOfDestinations: CargoDestination[]) {
    if (listOfDestinations.length) return ['Send cargo to warehouse B'];
    return ['No need to travel'];
  }
}
export class Estimate {
  toArrival(p0: string[]) {
    if (p0.length && p0[0].includes('B')) return 0;
    return 0;
  }
}
