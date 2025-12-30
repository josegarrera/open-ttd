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

 */

import { Estimate, Tycoon } from '../core/tycoon';

describe('Tycoon', () => {
  it('when remaining cargo is empty, no need to travel', () => {
    expect(new Tycoon().transport([])).toContain('Work finished');
  });

  it("when remaining cargo is 'B', send cargo to warehouse B", () => {
    expect(new Tycoon().transport(['B'])).toContain('Sent cargo to warehouse B');
  });

  it('After delivery to B, B is removed from the list', () => {
    expect(new Estimate().listAfterDelivery(['B', 'B'], ['Sent cargo to warehouse B'])).toEqual(['B']);
    expect(new Estimate().listAfterDelivery(['B'], ['Sent cargo to warehouse B'])).toEqual([]);
  });

  it('when there is no need to travel, arrival time is zero', () => {
    expect(new Estimate().toArrival(['Work finished'])).toBe(0);
  });

  it('if the distance from Factory to Warehouse B is 1, then the estimate is 1', () => {
    expect(new Estimate(1).toArrival(['Sent cargo to warehouse B'])).toBe(1);
  });
});
