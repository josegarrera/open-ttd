import { CargoDestination } from './tycoon';

const A = 'A';
const B = 'B';
const distanceToPort = 1;
const distanceToB = 5;

type LocationInfo = {
  label: 'A' | 'B';
  distance: number;
};

const Aplus: LocationInfo = {
  label: A,
  distance: distanceToPort,
};

const Bplus: LocationInfo = {
  label: B,
  distance: distanceToB,
};

export function estimatedArrival(cargo: CargoDestination[]) {
  return Math.max(
    ...aArrival(arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, Aplus))),
    ...arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, Bplus))
  );
}

function calculateArrivalTime(
  cargo: CargoDestination,
  now: number,
  { label: destination, distance: travelTime }: LocationInfo
): [number] | [] {
  if (cargo === destination) {
    return [now + travelTime];
  } else {
    return [];
  }
}

function arrivals(cargo: CargoDestination[], getTime: (cargo: CargoDestination, available: number) => [number] | []) {
  let availability: [number, number] = [0, 0];

  return cargo.flatMap((c) => {
    const time = getTime(c, Math.min(...availability));
    [availability] = truckAvailability(availability, c === 'A' ? 2 : 10);
    return time;
  });
}

export function portArrival(cargo: CargoDestination[]) {
  return arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, Aplus));
}

export function bArrival(cargo: CargoDestination[]) {
  return arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, Bplus));
}

export function aArrival(portArrival: number[]) {
  let shipAvailability = 0;
  return portArrival.map((arrival) => {
    const deliveredAt = Math.max(shipAvailability, arrival) + 4;
    shipAvailability = deliveredAt + 4;
    return deliveredAt;
  });
}

function truckAvailability(availability: [number, number], returnTime: number): [[number, number]] {
  const [t1, t2] = availability;
  let updatedAvailability: [number, number];
  if (t1 <= t2) updatedAvailability = [t1 + returnTime, t2];
  else updatedAvailability = [t1, t2 + returnTime];
  return [updatedAvailability];
}
