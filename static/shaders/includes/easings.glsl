const float PI = 3.141592653589793;

float easeInSine(float x) {
    return 1.0 - cos((x * PI) / 2.0);
}

float easeOutSine(float x) {
    return sin((x * PI) / 2.0);
}

float easeInOutSine(float x) {
    return -(cos(PI * x) - 1.0) / 2.0;
}

float easeInQuad(float x) {
    return x * x;
}

float easeOutQuad(float x) {
    return 1.0 - (1.0 - x) * (1.0 - x);
}

float easeInOutQuad(float x) {
    return x < 0.5 ? 2.0 * x * x : 1.0 - pow(-2.0 * x + 2.0, 2.0) / 2.0;
}

float easeInCubic(float x) {
    return x * x * x;
}

float easeOutCubic(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
}

float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

float easeInQuart(float x) {
    return x * x * x * x;
}

float easeOutQuart(float x) {
    return 1.0 - pow(1.0 - x, 4.0);
}

float easeInOutQuart(float x) {
    return x < 0.5 ? 8.0 * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 4.0) / 2.0;
}

float easeInQuint(float x) {
    return x * x * x * x * x;
}

float easeOutQuint(float x) {
    return 1.0 - pow(1.0 - x, 5.0);
}

float easeInOutQuint(float x) {
    return x < 0.5 ? 16.0 * x * x * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 5.0) / 2.0;
}

float easeInExpo(float x) {
    return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0);
}

float easeOutExpo(float x) {
    return x == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);
}

float easeInOutExpo(float x) {
    return x == 0.0 ? 0.0 :
    x == 1.0 ? 1.0 :
    x < 0.5 ? pow(2.0, 20.0 * x - 10.0) / 2.0 :
    (2.0 - pow(2.0, -20.0 * x + 10.0)) / 2.0;
}

float easeInCirc(float x) {
    return 1.0 - sqrt(1.0 - pow(x, 2.0));
}

float easeOutCirc(float x) {
    return sqrt(1.0 - pow(x - 1.0, 2.0));
}

float easeInOutCirc(float x) {
    return x < 0.5
    ? (1.0 - sqrt(1.0 - pow(2.0 * x, 2.0))) / 2.0
    : (sqrt(1.0 - pow(-2.0 * x + 2.0, 2.0)) + 1.0) / 2.0;
}

float easeInBack(float x) {
    const float c1 = 1.70158;
    const float c3 = c1 + 1.0;

    return c3 * x * x * x - c1 * x * x;
}

float easeOutBack(float x) {
    const float c1 = 1.70158;
    const float c3 = c1 + 1.0;

    return 1.0 + c3 * pow(x - 1.0, 3.0) + c1 * pow(x - 1.0, 2.0);
}

float easeInOutBack(float x) {
    const float c1 = 1.70158;
    const float c2 = c1 * 1.525;

    return x < 0.5
    ? (pow(2.0 * x, 2.0) * ((c2 + 1.0) * 2.0 * x - c2)) / 2.0
    : (pow(2.0 * x - 2.0, 2.0) * ((c2 + 1.0) * (x * 2.0 - 2.0) + c2) + 2.0) / 2.0;
}

float easeInElastic(float x) {
    const float c4 = (2.0 * PI) / 3.0;

    return x == 0.0
    ? 0.0
    : x == 1.0
    ? 1.0
    : -pow(2.0, 10.0 * x - 10.0) * sin((x * 10.0 - 10.75) * c4);
}

float easeOutElastic(float x) {
    const float c4 = (2.0 * PI) / 3.0;

    return x == 0.0
    ? 0.0
    : x == 1.0
    ? 1.0
    : pow(2.0, -10.0 * x) * sin((x * 10.0 - 0.75) * c4) + 1.0;
}

float easeInOutElastic(float x) {
    const float c5 = (2.0 * PI) / 4.5;

    return x == 0.0
    ? 0.0
    : x == 1.0
    ? 1.0
    : x < 0.5
    ? -(pow(2.0, 20.0 * x - 10.0) * sin((20.0 * x - 11.125) * c5)) / 2.0
    : (pow(2.0, -20.0 * x + 10.0) * sin((20.0 * x - 11.125) * c5)) / 2.0 + 1.0;
}

float easeOutBounce(float x) {
    const float n1 = 7.5625;
    const float d1 = 2.75;

    if (x < 1.0 / d1) {
        return n1 * x * x;
    } else if (x < 2.0 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

float easeInBounce(float x) {
    return 1.0 - easeOutBounce(1.0 - x);
}

float easeInOutBounce(float x) {
    return x < 0.5
    ? (1.0 - easeOutBounce(1.0 - 2.0 * x)) / 2.0
    : (1.0 + easeOutBounce(2.0 * x - 1.0)) / 2.0;
}