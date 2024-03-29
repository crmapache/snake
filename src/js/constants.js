const W_KEYCODE = 87;
const D_KEYCODE = 68;
const S_KEYCODE = 83;
const A_KEYCODE = 65;

const U_KEYCODE = 85;
const K_KEYCODE = 75;
const J_KEYCODE = 74;
const H_KEYCODE = 72;

const UP_ARROW_KEYCODE     = 38;
const RIGTH_ARROW_KEYCODE  = 39;
const BOTTOM_ARROW_KEYCODE = 40;
const LEFT_ARROW_KEYCODE   = 37;

export default {
  PLAYERS_KEYCODES: {
    1: [
      W_KEYCODE, D_KEYCODE,
      S_KEYCODE, A_KEYCODE
    ],
    2: [
      U_KEYCODE, K_KEYCODE,
      J_KEYCODE, H_KEYCODE
    ],
    3: [
      UP_ARROW_KEYCODE, RIGTH_ARROW_KEYCODE,
      BOTTOM_ARROW_KEYCODE, LEFT_ARROW_KEYCODE
    ]
  },
  
  SPACE_KEYCODE: 32,
  
  DRAW_INTERVAL: 33,
  
  DEFAULT_DIFFICULTY: 7,
  
  BONUS_FIELD_TIME:  15,
  BONUS_ACTIVE_TIME: 10,
  
  RABBIT_NUTRITIONALLY: 5,
  RABBIT_MAX_HEALTH:    99.999999,
  RABBIT_MIN_HEALTH:    10,
  
  FIELD_WIDTH:  40,
  FIELD_HEIGHT: 25,
};