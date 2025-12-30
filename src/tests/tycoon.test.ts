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
> If the distance from Factory to Warehouse B is 5, then the estimate is 5.

 */

import { Estimate, Tycoon } from '../core/tycoon';

describe('Tycoon', () => {
  it('when remaining cargo is empty, no need to travel', () => {
    expect(new Tycoon().transport([])).toContain('No need to travel');
  });

  it("when remaining cargo is 'B', send cargo to warehouse B", () => {
    expect(new Tycoon().transport(['B'])).toContain('Send cargo to warehouse B');
  });

  it('when there is no need to travel, arrival time is zero', () => {
    expect(new Estimate().toArrival()).toBe(0);
  });
});
