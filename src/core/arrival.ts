import { Location, Destination } from './tycoon';

const A = 'A';
const B = 'B';
const Port = 'Port';
const distanceToPort = 1;
const distanceToB = 5;
const distanceToA = 4;

type LocationInfo = {
  destination: Destination;
  nextLocation: Location;
  distance: number;
};

const aInfo: LocationInfo = {
  nextLocation: A,
  destination: A,
  distance: distanceToA,
};

const portInfo: LocationInfo = {
  nextLocation: Port,
  destination: A,
  distance: distanceToPort,
};

const bInfo: LocationInfo = {
  nextLocation: B,
  destination: B,
  distance: distanceToB,
};

export function estimatedArrival(cargo: Destination[]) {
  return Math.max(
    ...aArrival(arrivals(cargo, (nextStop, av) => calculateArrivalTime(nextStop, av, portInfo))),
    ...arrivals(cargo, (nextStop, av) => calculateArrivalTime(nextStop, av, bInfo))
  );
}

function moveToA(c: 'A', trucksAvailability: [number, number], shipsAvailability: number[]) {
  return aArrival(
    arrivals([c], (nextStop, av) => calculateArrivalTime(nextStop, av, portInfo), trucksAvailability),
    shipsAvailability
  );
}

function moveToB(c: 'B', trucksAvailability: [number, number]) {
  return arrivals([c], (nextStop, av) => calculateArrivalTime(nextStop, av, bInfo), trucksAvailability);
}

export function estimatedArrivalTwo(cargo: Destination[]) {
  let trucksAvailability: [number, number] = [0, 0];
  let shipsAvailability = [0];
  const deliveries = cargo.flatMap((c) => {
    switch (c) {
      case A:
        return moveToA(c, trucksAvailability, shipsAvailability);
      case B:
        return moveToB(c, trucksAvailability);
    }
  });
  return Math.max(...deliveries);
}

function calculateArrivalTime(
  cargo: Location,
  now: number,
  { nextLocation: destination, distance: travelTime }: LocationInfo
): [number] | [] {
  if (cargo === destination) {
    return [now + travelTime];
  } else {
    return [];
  }
}

function getReturnTime(c: Location) {
  const locationsTable = {
    [aInfo.nextLocation]: aInfo.distance * 2,
    [portInfo.nextLocation]: portInfo.distance * 2,
    [bInfo.nextLocation]: bInfo.distance * 2,
  };
  return locationsTable[c];
}

function arrivals(
  cargo: Destination[],
  getTime: (cargo: Location, available: number) => [number] | [],
  availability: [number, number] = [0, 0]
) {
  return cargo.flatMap((c) => {
    const time = getTime(c === A ? Port : B, Math.min(...availability));
    const returnTime = getReturnTime(c === A ? Port : B);
    const [[t1, t2]] = truckAvailability(availability, returnTime);
    availability[0] = t1;
    availability[1] = t2;
    return time;
  });
}

export function portArrival(cargo: Destination[]) {
  return arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, portInfo));
}

export function bArrival(cargo: Destination[]) {
  return arrivals(cargo, (cargo, av) => calculateArrivalTime(cargo, av, bInfo));
}

export function aArrival(portArrival: number[], shipAvailability = [0]) {
  return portArrival.map((arrival) => {
    const timeAtDeparture = Math.max(...shipAvailability, arrival);
    const deliveredAt = timeAtDeparture + aInfo.distance;
    shipAvailability[0] = timeAtDeparture + getReturnTime(A);
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
