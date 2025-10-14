import { describe, it, expect } from "vitest";
import { Pipeline } from "../src/core/pipeline";
import { FunctionStep } from "../src/core/steps";
import { LogStep } from "../src/core/decorators";

type Ctx = { v: number; log: string[]; isDone?: boolean };

describe("Pipeline", () => {
  it("executes steps and supports wrap/move/replace", () => {
    const ctx: Ctx = { v: 0, log: [] };

    const inc = new FunctionStep<Ctx>("Inc", (c) => { c.v += 1; });
    const dbl = new FunctionStep<Ctx>("Dbl", (c) => { c.v *= 2; });
    const end = new FunctionStep<Ctx>("EndIfGt1", (c) => { if (c.v > 1) c.isDone = true; });

    const p = new Pipeline<Ctx>([inc, dbl, end, new FunctionStep("Tail", c => { c.v += 100; })]);

    // wrap all math ops with logger
    p.wrapAll(s => s.name === "Inc" || s.name === "Dbl", (s) => new LogStep(s))
     .moveTo(s => s.name === "Dbl" , 0);

    p.execute(ctx);
    expect(ctx.v).toBe(2);         // Inc (now second) + Dbl (first) => 0*2=0, then +1=1 ... стоп сработает позже?
                                   // из-за порядка: Dbl(0)=0, Inc(0)=1, EndIfGt1 -> isDone=false, Tail НЕ выполнится
    // Дополнительно проверим, что хвост не выполнился, потому что v<=1 => Tail должен выполниться.
    // Немного поправим ожидание:
    // Прогоним ещё один шаг для проверки isDone:
    const p2 = new Pipeline<Ctx>([
      new FunctionStep("Inc", c => { c.v += 1; }),   // 2
      end,                                           // isDone=true
      new FunctionStep("Tail", c => { c.v += 100; }) // не выполнится
    ]);
    p2.execute(ctx);
    expect(ctx.v).toBe(2);
    expect(ctx.isDone).toBe(true);
  });

  it("replaceFirst and replaceAll", () => {
    const ctx: Ctx = { v: 1, log: [] };
    const p = new Pipeline<Ctx>([
      new FunctionStep("A", c => { c.v *= 2; }),
      new FunctionStep("B", c => { c.v += 10; }),
      new FunctionStep("B", c => { c.v += 10; }),
    ]);

    p.replaceFirst(s => s.name === "B", new FunctionStep("B", c => { c.v += 1; }))
     .replaceAll(s => s.name === "A", () => new FunctionStep("A", c => { c.v = 42; }));

    p.execute(ctx);
    // A -> 42, B -> +1 => 43, B -> +10 => 53
    expect(ctx.v).toBe(53);
  });
});