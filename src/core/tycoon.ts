export class Tycoon {
  transport(p0?: string[]) {
    if (p0) return ['Send cargo to warehouse B'];
    return ['No need to travel'];
  }
}
export class Estimate {
  toArrival() {
    return 0;
  }
}
