// With thanks to https://easings.net/

export namespace Ease {
  function inSine(x: number): number {
    return 1 - Math.cos((x * Math.PI) / 2);
  }

  function outSine(x: number): number {
    return Math.sin((x * Math.PI) / 2);
  }

  function inOutSine(x: number): number {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }

  function inQuad(x: number): number {
    return x * x;
  }

  function outQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  function inOutQuad(x: number): number {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  }

  function inCubic(x: number): number {
    return x * x * x;
  }

  function outCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  function inOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function inQuart(x: number): number {
    return x * x * x * x;
  }

  function outQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4);
  }

  function inOutQuart(x: number): number {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
  }

  function inQuint(x: number): number {
    return x * x * x * x * x;
  }

  function outQuint(x: number): number {
    return 1 - Math.pow(1 - x, 5);
  }

  function inOutQuint(x: number): number {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  function inExpo(x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
  }

  function outExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function inOutExpo(x: number): number {
    return x === 0
      ? 0
      : x === 1
        ? 1
        : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2;
  }

  function inCirc(x: number): number {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
  }

  function outCirc(x: number): number {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  function inOutCirc(x: number): number {
    return x < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
  }

  function inBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return c3 * x * x * x - c1 * x * x;
  }

  function outBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  }

  function inOutBack(x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }

  function inElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
  }

  function outElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
      ? 0
      : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  }

  function inOutElastic(x: number): number {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
      ? 0
      : x === 1
        ? 1
        : x < 0.5
          ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
  }

  function inBounce(x: number): number {
    return 1 - outBounce(1 - x);
  }

  function outBounce(x: number): number {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
      return n1 * x * x;
    } else if (x < 2 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
  }

  function inOutBounce(x: number): number {
    return x < 0.5
      ? (1 - outBounce(1 - 2 * x)) / 2
      : (1 + outBounce(2 * x - 1)) / 2;
  }
}