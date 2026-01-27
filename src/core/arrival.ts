import { CargoDestination } from './tycoon';

export function estimatedArrival(cargo: CargoDestination[]) {
  return Math.max(...aArrival(portArrival(cargo)), ...bArrival(cargo));
}

function truck(cargo: CargoDestination[], destination: string, travelTime: number) {
  let currentAvailability: [number, number] = [0, 0];
  const arrivalTimes = [];
  for (let i = 0; i < cargo.length; i++) {
    if (cargo.slice(i)[0] === destination) arrivalTimes.push(Math.min(...currentAvailability) + travelTime);
    [currentAvailability] = truckAvailability(currentAvailability, cargo.slice(i));
  }
  return arrivalTimes;
}

export function portArrival(cargo: CargoDestination[]) {
  return truck(cargo, 'A', 1);
}

export function bArrival(cargo: CargoDestination[]) {
  return truck(cargo, 'B', 5);
}

export function aArrival(portArrival: number[]) {
  let shipAvailability = 0;
  return portArrival.map((arrival) => {
    const deliveredAt = Math.max(shipAvailability, arrival) + 4;
    shipAvailability = deliveredAt + 4;
    return deliveredAt;
  });
}

function truckAvailability(
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
