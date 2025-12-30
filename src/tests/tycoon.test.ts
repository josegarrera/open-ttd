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

> If we have 2 trucks, when all of them are busy, the next cargo gets picked up at the first
 available time. (Example: BBB)

 */

import { DONE, Estimate, SENT_TO_B, Tycoon } from '../core/tycoon';

describe('Tycoon', () => {
  it('when remaining cargo is empty, no need to travel', () => {
    expect(new Tycoon().transport([])).toContain(DONE);
  });

  it("when remaining cargo is 'B', send cargo to warehouse B", () => {
    expect(new Tycoon().transport(['B'])).toContain(SENT_TO_B);
  });

  it('After delivery to B, B is removed from the list', () => {
    expect(new Estimate().listAfterDelivery(['B', 'B'], [SENT_TO_B])).toEqual(['B']);
    expect(new Estimate().listAfterDelivery(['B'], [SENT_TO_B])).toEqual([]);
    expect(new Estimate().listAfterDelivery(['B', 'B'], [SENT_TO_B, SENT_TO_B])).toEqual([]);
  });

  it('when there is no need to travel, arrival time is zero', () => {
    expect(new Estimate().toArrival([DONE])).toBe(0);
  });

  it('if the distance from Factory to Warehouse B is 1, then the estimate is 1', () => {
    expect(new Estimate(1).toArrival([SENT_TO_B])).toBe(1);
  });
});
