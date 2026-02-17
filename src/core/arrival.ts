import { Destination, Location } from './tycoon';

export const A = 'A';
export const B = 'B';
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
  let trucksAvailability: [number, number] = [0, 0];
  let shipsAvailability = [0];
  const deliveries = moveCargo(cargo, trucksAvailability, shipsAvailability);
  return Math.max(...deliveries);
}

export function moveCargo(
  cargo: Destination[],
  trucksAvailability: [number, number] = [0, 0],
  shipsAvailability: number[] = [0]
) {
  return cargo.flatMap((c) => {
    switch (c) {
      case A:
        return moveToA([c], trucksAvailability, shipsAvailability);
      case B:
        return moveToB([c], trucksAvailability);
    }
  });
}

export function moveToA(
  c: Destination[],
  trucksAvailability: [number, number] = [0, 0],
  shipsAvailability: number[] = [0]
) {
  return c.flatMap((cargo) =>
    arrivals(cargo, (nextStop: Location, av: number) => [getArrivalTime(av, nextStop)], trucksAvailability).map(
      (arrival) => aArrival(arrival, shipsAvailability)
    )
  );
}

export function moveToB(c: Destination[], trucksAvailability: [number, number] = [0, 0]) {
  return c.flatMap((cargo) =>
    arrivals(cargo, (nextStop: Location, av: number) => [getArrivalTime(av, nextStop)], trucksAvailability)
  );
}

function getReturnTime(c: Location) {
  const locationsTable = {
    [aInfo.nextLocation]: aInfo.distance * 2,
    [portInfo.nextLocation]: portInfo.distance * 2,
    [bInfo.nextLocation]: bInfo.distance * 2,
  };
  return locationsTable[c];
}

function getArrivalTime(now: number, nextStop: Location) {
  const locationsTable = {
    [aInfo.nextLocation]: aInfo.distance,
    [portInfo.nextLocation]: portInfo.distance,
    [bInfo.nextLocation]: bInfo.distance,
  };
  return now + locationsTable[nextStop];
}

function arrivals(
  cargo: Destination,
  getTime: (cargo: Location, available: number) => [number] | [],
  availability: [number, number] = [0, 0]
) {
  const time = getTime(cargo === A ? Port : B, Math.min(...availability));
  const returnTime = getReturnTime(cargo === A ? Port : B);
  const [[t1, t2]] = truckAvailability(availability, returnTime);
  availability[0] = t1;
  availability[1] = t2;
  return time;
}

export function portArrival(cargo: Destination[], truckAvailability: [number, number] = [0, 0]) {
  return cargo.flatMap((c) =>
    arrivals(c, (nextStop: Location, av: number) => [getArrivalTime(av, nextStop)], truckAvailability)
  );
}

export function aArrival(arrival: number, shipAvailability = [0]) {
  const timeAtDeparture = Math.max(...shipAvailability, arrival);
  const deliveredAt = timeAtDeparture + aInfo.distance;
  shipAvailability[0] = timeAtDeparture + getReturnTime(A);
  return deliveredAt;
}

function truckAvailability(availability: [number, number], returnTime: number): [[number, number]] {
  const [t1, t2] = availability;
  let updatedAvailability: [number, number];
  if (t1 <= t2) updatedAvailability = [t1 + returnTime, t2];
  else updatedAvailability = [t1, t2 + returnTime];
  return [updatedAvailability];
}
