(() => {
  "use strict";

  const g = 9.8;
  const l1 = 0.5;
  const l2 = 0.5;
  const m1 = 0.5;
  const m2 = 0.3;

  const epsilon = 5e-5;

  const FPS = 30;
  const iterPerFrame = 10;
  const dt = 1.0 / (FPS * iterPerFrame);

  let numPendulum;
  let doublePendulums = [];

  class DoublePendulum {
    constructor(theta1, theta2, theta1dot, theta2dot, pendulumColor) {
      this.set_qp_from_theta(theta1, theta2, theta1dot, theta2dot);
      this.pendulumColor = pendulumColor;
    }

    run() {
      for (let i = 0; i < iterPerFrame; i++) {
        this.hamilton_advance();
      }
      this.render();
    }

    hamilton_advance() {
      const nx = this.newton(this.q1 - this.q2);

      const F1nx = this.F1(nx);
      const F2nx = this.F2(nx);
      const Gnx = this.G(nx);

      const nq1 = this.q1 + (dt * F1nx) / (Math.pow(l1, 2) * l2 * Gnx);
      const nq2 = this.q2 + (dt * F2nx) / (m2 * l1 * Math.pow(l2, 2) * Gnx);
      const np1 =
        this.p1 +
        dt *
          (-(F1nx * F2nx * Math.sin(nx)) /
            (Math.pow(l1, 2) * Math.pow(l2, 2) * Math.pow(Gnx, 2)) -
            (m1 + m2) * l1 * g * Math.sin(nq1));
      const np2 =
        this.p2 +
        dt *
          ((F1nx * F2nx * Math.sin(nx)) /
            (Math.pow(l1, 2) * Math.pow(l2, 2) * Math.pow(Gnx, 2)) -
            m2 * l2 * g * Math.sin(nq2));

      this.q1 = nq1;
      this.q2 = nq2;
      this.p1 = np1;
      this.p2 = np2;
    }

    F1(x) {
      return l2 * this.p1 - l1 * this.p2 * Math.cos(x);
    }

    F1_prime(x) {
      return l1 * this.p2 * Math.sin(x);
    }

    F2(x) {
      return (m1 * l1 + m2 * l1) * this.p2 - m2 * l2 * this.p1 * Math.cos(x);
    }

    F2_prime(x) {
      return m2 * l2 * this.p1 * Math.sin(x);
    }

    G(x) {
      return m1 + m2 - m2 * Math.pow(cos(x), 2);
    }

    G_prime(x) {
      return 2 * m2 * Math.sin(x) * Math.cos(x);
    }

    f(x) {
      return (
        x -
        (this.q1 +
          (dt * this.F1(x)) / (Math.pow(l1, 2) * l2 * this.G(x)) -
          this.q2 -
          (dt * this.F2(x)) / (m2 * l1 * Math.pow(l2, 2) * this.G(x)))
      );
    }

    f_prime(x) {
      return (
        1 -
        ((dt * (this.F1_prime(x) * this.G(x) - this.F1(x) * this.G_prime(x))) /
          (Math.pow(l1, 2) * l2 * Math.pow(this.G(x), 2)) -
          (dt * (this.F2_prime(x) * this.G(x) - this.F2(x) * this.G_prime(x))) /
            (m2 * l1 * Math.pow(l2, 2) * Math.pow(this.G(x), 2)))
      );
    }

    newton(x0) {
      let x = x0;
      while (abs(this.f(x)) > epsilon) {
        x -= this.f(x) / this.f_prime(x);
      }
      return x;
    }

    render() {
      fill(this.pendulumColor);
      stroke(this.pendulumColor);

      const zoom = document.getElementById("defaultCanvas0").height * 0.22;

      const theta1 = this.q1;
      const theta2 = this.q2;

      const x1 = l1 * Math.sin(theta1) * zoom;
      const y1 = l1 * Math.cos(theta1) * zoom;
      const x2 = x1 + l2 * Math.sin(theta2) * zoom;
      const y2 = y1 + l2 * Math.cos(theta2) * zoom;

      const r0 = 0.03 * zoom;
      ellipse(0, 0, r0, r0);
      line(0, 0, x1, y1);
      const r1 = 0.05 * zoom;
      ellipse(x1, y1, r1, r1);
      line(x1, y1, x2, y2);
      const r2 = 0.05 * zoom;
      ellipse(x2, y2, r2, r2);
    }

    p_def_matrix() {
      let ret = [];

      ret[0] = (m1 + m2) * Math.pow(l1, 2);
      ret[1] = m2 * l1 * l2 * Math.cos(this.q1 - this.q2);
      ret[2] = m2 * l1 * l2 * Math.cos(this.q1 - this.q2);
      ret[3] = m2 * Math.pow(l2, 2);

      return ret;
    }

    set_qp_from_theta(theta1, theta2, theta1dot, theta2dot) {
      this.q1 = theta1;
      this.q2 = theta2;

      const m = this.p_def_matrix();
      let a = m[0],
        b = m[1],
        c = m[2],
        d = m[3];

      this.p1 = a * theta1dot + b * theta2dot;
      this.p2 = c * theta1dot + d * theta2dot;
    }
  }

  function init(theta1 = 2, theta2 = 2, theta1dot = 0, theta2dot = 0) {
    function hsl2rgb(h, s, l) {
      let max = 0,
        min = 0;
      let r = 0,
        g = 0,
        b = 0;
      if (l < 50) {
        max = 2.55 * (l + (l * s) / 100);
        min = 2.55 * (l - (l * s) / 100);
      } else {
        max = 2.55 * (l + ((100 - l) * s) / 100);
        min = 2.55 * (l - ((100 - l) * s) / 100);
      }
      if (h < 0 || 360 < h) {
        console.error("invalid h value");
      } else if (h < 60) {
        r = max;
        g = min + ((max - min) * h) / 60;
        b = min;
      } else if (h < 120) {
        r = min + ((max - min) * (120 - h)) / 60;
        g = max;
        b = min;
      } else if (h < 180) {
        r = min;
        g = max;
        b = min + ((max - min) * (h - 120)) / 60;
      } else if (h < 240) {
        r = min;
        g = min + ((max - min) * (240 - h)) / 60;
        b = max;
      } else if (h < 300) {
        r = min + ((max - min) * (h - 240)) / 60;
        g = min;
        b = max;
      } else {
        r = max;
        g = min;
        b = min + ((max - min) * (360 - h)) / 60;
      }
      r = Math.round(r);
      g = Math.round(g);
      b = Math.round(b);
      return `rgb(${r},${g},${b})`;
    }

    doublePendulums = [];
    for (let i = 0; i < numPendulum; i++) {
      doublePendulums[i] = new DoublePendulum(
        theta1 + (1e-3 * i) / numPendulum,
        theta2 + (1e-3 * i) / numPendulum,
        theta1dot,
        theta2dot,
        hsl2rgb((i * 360) / numPendulum, 50, 50)
      );
    }
  }

  function setNumPendulum(newNumPendulum) {
    numPendulum = newNumPendulum;
    document.getElementById(
      "label-number-of-pendulum"
    ).textContent = `振り子の個数：${numPendulum} 個`;
    init();
  }

  window.setup = () => {
    const shape = document.body.getBoundingClientRect();
    const size = Math.min(shape.width, shape.height) * 0.9;
    width = height = size;

    const canvas = createCanvas(width, height);
    const container = document.getElementById("canvas-container");
    canvas.parent(container);

    document
      .getElementById("defaultCanvas0")
      .addEventListener("click", (evt) => {
        const theta = Math.atan2(
          evt.offsetX - size / 2,
          evt.offsetY - size / 2
        );
        init(theta, theta, 0, 0);
      });

    const slider = document.getElementById("slider-number-of-pendulum");
    setNumPendulum(slider.value);
    slider.addEventListener("change", (evt) => {
      setNumPendulum(evt.currentTarget.value);
    });

    background(50);
    frameRate(FPS);
  };

  window.draw = () => {
    background(50);
    translate(width / 2, height / 2);
    strokeWeight(3);
    doublePendulums.forEach((dp) => {
      dp.run();
    });
  };
})();
