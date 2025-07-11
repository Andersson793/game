import p5 from "p5";

const setup = (p) =>
  function () {
    const mycanvas = p.createCanvas(200, 200);

    p.frameRate(12);
    p.background(50);

    mycanvas.parent("conteiner");
  };

const draw = (p) =>
  function () {
    p.rect(0, 0, 50, 50);
    p.fill(255);
  };

const intance = (p) => {
  p.setup = setup(p);
  p.draw = draw(p);
};

new p5(intance);
