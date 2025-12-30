/*
# Test plan

## Conversation 1
- No cargo list: Answer (projection) -> 0
  - Why? We don't need to travel
> When remaining cargo is empty, no need to travel. ( BLUE -> ORANGE )
> When there is no need to travel, arrival time is zero. ( EVENT -> PROJECTION )

 */

import { Tycoon } from '../core/tycoon';

describe('Tycoon', () => {
  it('when remaining cargo is empty, no need to travel', () => {
    expect(new Tycoon().transport()).toContain('No need to travel');
  });
});
