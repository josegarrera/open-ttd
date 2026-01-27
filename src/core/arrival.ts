import type { CargoDestination } from './tycoon';

export function truckAvailability(
  availability: [number, number],
  cargo: CargoDestination[]
): [[number, number], CargoDestination[]] {
  if (cargo.length === 0) return [availability, cargo];
  const [t1, t2] = availability;
  let updatedAvailability: [number, number];
  const returnTime = cargo[0] === 'A' ? 2 : 10;
  if (t1 <= t2) updatedAvailability = [t1 + returnTime, t2];
  else updatedAvailability = [t1, t2 + returnTime];
  return [updatedAvailability, cargo.slice(1)];
}

export function portArrival(cargo: CargoDestination[]) {
  let currentAvailability: [number, number] = [0, 0];
  const arrivalTimes = [];
  for (let i = 0; i < cargo.length; i++) {
    if (cargo.slice(i)[0] === 'A') arrivalTimes.push(Math.min(...currentAvailability) + 1);
    [currentAvailability] = truckAvailability(currentAvailability, cargo.slice(i));
  }
  return arrivalTimes;
}

export function aArrival(portArrival: number[]) {
  let shipAvailability = 0;
  return portArrival.map((arrival) => {
    const deliveredAt = Math.max(shipAvailability, arrival) + 4;
    shipAvailability = deliveredAt + 4;
    return deliveredAt;
  });
}

export function bArrival(cargo: CargoDestination[]) {
  let currentAvailability: [number, number] = [0, 0];
  const arrivalTimes = [];
  for (let i = 0; i < cargo.length; i++) {
    if (cargo.slice(i)[0] === 'B') arrivalTimes.push(Math.min(...currentAvailability) + 5);
    [currentAvailability] = truckAvailability(currentAvailability, cargo.slice(i));
  }
  return arrivalTimes;
}
