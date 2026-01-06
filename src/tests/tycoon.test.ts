/*
# Test plan

## Conversation 1
- No cargo list: Answer (projection) -> 0
  - Why? We don't need to travel
> When remaining cargo is empty, no need to travel. ( BLUE -> ORANGE )
> When there is no need to travel, arrival time is zero. ( EVENT -> PROJECTION )

## Conversation 2
- One cargo to destination: Warehouse B
  - Because the list is not empty
  - Need to travel by land to B. Why? Path has to be defined from Factory to B.
    - We have a distance from Factory to B.
  - After delivery, _this cargo_ is removed from the list

> When remaining cargo is 'B', send cargo to warehouse B.
> If the distance from Factory to Warehouse B is 0, then the estimate is 0.
> If the distance from Factory to Warehouse B is 5, then the estimate is 5.
> After delivery, B is removed from the list

## Conversation 3
- Two cargos to destination: Warehouse B (['B', 'B'])
  - Because the list is not empty
  - There are two trucks. What does that mean?
    - We can send two cargos at the same time.
    - Example: BB vs. BBB
      - BB: [SENT_TO_B@0, SENT_TO_B@0]
      - BBB: [SENT_TO_B@0, SENT_TO_B@0, SENT_TO_B@10], assuming Distance to WH b = 5
      Why is it 10? Because the truck needs to return
    - Pickup time is important for the cargo
  - The return time is relative to the availability of the trucks
    - What does this mean?
      - It means we need to pick a truck, and calculate when it returns based on its _last_ sentAt.

> When we have more cargos than trucks and the distance is non zero, cargo needs to wait
> When all trucks are busy, the next truck returns at <last sentAt> + returnTime
> Waiting Cargo at the factory is picked up when the first truck returns from its destination.
 (return = distance * 2) From the departure of the earlier truck

## Conversation 4
Assuming distance to B is 5 and 2 trucks.
- BBB Estimate needs to be 15.
  - Why?
    - 2 pickups at 0, B1 delivered at 5, B2 delivered at 5
    - 3rd pickup at 10, B3 delivered at 15.

> The estimate is the last cargo in the list + distance to b.

### Conversation 5
How do we go to the port? Assuming ['B', 'PORT']
> Cargo with destination to PORT gets sent to Port when list is not empty
> Destination to PORT is different from destination to B
> Return time from PORT is different from return time from B
 */

import { CargoDestination, Estimate, Sent, SENT_TO_B, SENT_TO_PORT, Tycoon } from '../core/tycoon';

describe('Tycoon', () => {
  it('when remaining cargo is empty, no need to travel', () => {
    expect(new Tycoon().transport([])).toHaveLength(0);
  });

  it("when remaining cargo is 'B', send cargo to warehouse B", () => {
    expect(new Tycoon().transport(['B'])).toContainEqual(SENT_TO_B);
  });

  it('when we have more cargos than trucks and the distance is non zero, cargo needs to wait', () => {
    const [, sentAt] = new Tycoon(2, 15).transport(['B'], [SENT_TO_B, SENT_TO_B]).toString().split('@');
    expect(Number(sentAt)).toBeGreaterThan(0);
  });

  it('When all trucks are busy, the next truck returns at last sentAt + returnTime', () => {
    const returnTime = 15;
    const lastSent10 = 10;
    const sentToBAt10 = new Sent('B', lastSent10);
    const [, sentAt2] = new Tycoon(2, returnTime).transport(['B'], [sentToBAt10, sentToBAt10]).toString().split('@');
    expect(Number(sentAt2)).toBe(lastSent10 + returnTime);
  });

  it('After delivery to B, B is removed from the list', () => {
    expect(new Estimate().listAfterDelivery(['B', 'B'], [SENT_TO_B])).toEqual(['B']);
    expect(new Estimate().listAfterDelivery(['B'], [SENT_TO_B])).toEqual([]);
    expect(new Estimate().listAfterDelivery(['B', 'B'], [SENT_TO_B, SENT_TO_B])).toEqual([]);
  });

  it('when there is no need to travel, arrival time is zero', () => {
    expect(new Estimate(5).toArrival([])).toBe(0);
  });

  it('if the distance from Factory to Warehouse B is 1, then the estimate is 1', () => {
    expect(new Estimate(1).toArrival([SENT_TO_B])).toBe(1);
  });

  it('the estimate is the latest (cargo in the list sentAt + distance to b)', () => {
    expect(new Estimate(100).toArrival([new Sent('B', 50)])).toBe(150);
    expect(new Estimate(100).toArrival([new Sent('B', 50), new Sent('B', 100)])).toBe(200);
    expect(new Estimate(100).toArrival([new Sent('B', 120), new Sent('B', 70)])).toBe(220);
  });

  it("when remaining cargo is 'PORT', send cargo to Port", () => {
    expect(new Tycoon().transport(['Port'])).toContainEqual(SENT_TO_PORT);
  });

  it('if the distance from Factory to Port is 3, then the estimate is 3', () => {
    expect(new Estimate(Infinity, 3).toArrival([SENT_TO_PORT])).toBe(3);
  });

  it('return time from port is different from return time from B', () => {
    const returnTimeFromB = 10;
    const returnTimeFromPort = 2;
    const sentToPortAt5 = new Sent('Port', 5);
    const [, sentAt2] = new Tycoon(2, returnTimeFromB, returnTimeFromPort)
      .transport(['B'], [sentToPortAt5, sentToPortAt5])
      .toString()
      .split('@');
    expect(Number(sentAt2)).toBe(5 + returnTimeFromPort);
  });

  describe('Acceptance', () => {
    it('Example: PortBB', () => {
      const cargo: CargoDestination[] = ['Port', 'B', 'B'];
      let events: Sent[] = [];
      const t = new Tycoon(2, 10, 2);
      const e = new Estimate(5, 1);
      for (const c of cargo) {
        events.push(...t.transport([c], events));
      }

      expect(e.toArrival(events)).toBe(7);
    });
  });
});
