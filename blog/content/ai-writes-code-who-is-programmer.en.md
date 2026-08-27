Not long ago, the answer seemed obvious: a programmer was the person who wrote the code. But what happens when AI can write most of the implementation, while the human defines the problem, chooses the direction, verifies the result, and remains responsible for the system that actually ships?

![The old engineer and the vibe coder](assets/01-engineer-vs-vibecoder.avif "Two approaches to development: experience with constraints and freedom to experiment")

Only a few years ago, the path into software development was fairly easy to describe. To build an application, you had to learn a programming language, pick up a framework, understand databases, environments, builds, deployment, and dozens of other things whose names beginners often discovered only after breaking them for the first time.

Today, a new layer sits between the idea and the code: AI.

Part of this spectrum is now called vibe coding: instead of describing the implementation line by line, a person increasingly explains what they want, evaluates what the model produces, and steers the next iteration. That does not necessarily mean having no technical knowledge at all, but it does make possible a situation that would have looked almost paradoxical not long ago.

A person may not know a language's syntax, may be unable to write a Dockerfile from scratch, and may not even know the difference between an integration test and a unit test. Yet they can still describe **how the system should behave**, ask AI to build it, run the result, notice a problem, change the requirements, and repeat the cycle until the application does what was intended.

To a traditional programmer, this can look almost contradictory. How can someone build a working system without mastering every tool from which it is assembled?

Perhaps the contradiction exists only because we have spent too long treating programming as synonymous with writing code by hand.

*In an old workshop, a large dog engineer knew the price of every mistake. He could see where the motor would overheat, where the transmission would slip, and where a tiny crack would become a serious failure a month later.*

*One day, a small adult rabbit arrived with an old laptop. He barely knew the names of the tools, but he had a very clear picture of a machine that did not yet exist.*

*The dog looked at the sketches and said, “That will be very difficult.”*

*The rabbit shrugged. “All right. What if we try anyway?”*

## Programming has always moved upward through layers of abstraction

It is easy to forget how radically programming has already changed.

There was a time when working with a computer meant operating very close to the machine itself. Then came assembly languages. Then high-level languages. Compilers began doing work that programmers once had to control directly. Runtime systems and garbage collectors took over parts of memory management. Frameworks hid repetitive infrastructure. Cloud platforms turned servers, databases, and queues into services that could be provisioned almost as finished components.

Each step moved the developer farther away from the physical details of the machine.

And almost every step had someone saying, “That is not real programming anymore.”

![The abstraction ladder](assets/02-abstraction-ladder.avif "From machine details to languages, frameworks, and AI-native development")

The industry did not move forward because developers became lazier. It moved forward because **attention freed from lower-level work could be spent on higher-level problems**.

If a compiler can reliably turn a high-level language into machine instructions, most developers no longer need to do that translation manually. If a cloud platform can provision a managed database, every team does not need to begin a project by installing PostgreSQL on a bare server.

AI continues the same trend, but the jump is much larger.

What is being automated now is not a single mechanical operation, but entire chains of engineering work:

- writing an implementation;
- selecting a library;
- creating tests;
- finding a bottleneck;
- preparing a container;
- configuring CI;
- writing documentation;
- analyzing an error;
- proposing an architectural change.

That is why the argument over whether someone is “a programmer” if they do not write most of the code by hand may turn out to be a temporary argument about where the abstraction boundary sits.

## You can misunderstand the tool's name and still understand the problem

Imagine someone who has never used Docker.

They do not know the terms `image`, `container`, `volume`, or `multi-stage build`. But they can formulate the requirement:

> “I want my application to run on someone else's computer the same way it runs on mine, without making them install a dozen dependencies by hand.”

To an engineer, that sentence maps almost automatically onto a set of technical solutions.

A modern model can make the same translation.

![From intent to an engineering system](assets/03-intent-to-engineering.avif "AI as a translator between human intent and engineering implementation")

A person can say:

> “If the service crashes in the middle of a job, the job must not disappear.”

AI may propose a queue, retries, durable state, and idempotent processing.

The person may not know the word **idempotency**. They can still understand the desired behavior perfectly well:

> “If the operation runs twice, I do not want two identical records.”

That distinction matters.

**Not knowing the professional term does not always mean not understanding the problem.**

In the past, a specialist often had to stand between an everyday description of behavior and its engineering implementation. AI is increasingly capable of playing that translator role.

What the human needs instead is the ability to state the intent clearly enough and to notice when the result does not match it.

*The rabbit did not know what many parts in the workshop were called.*

*He spoke more simply: “If the engine stalls, the cargo must not vanish. If I give the machine to my neighbor, it should start for him too. If something inside begins to overheat, I want to know before I see smoke.”*

*Small mechanical helpers turned those sentences into gears, fuses, sensors, and new circuits.*

*At first, the dog frowned at the language. Then he noticed that the requirements were perfectly engineering-minded. They just did not use engineering vocabulary.*

## “But AI made it”

This is probably the most natural objection to the new approach.

Someone presents a working project and says they built it. An experienced developer opens the repository and asks:

> “But you could not have written half of this without AI.”

That may be true.

By itself, however, it says very little about the quality of the result.

A Java programmer does not have to write their own JVM. A Python developer does not have to implement the interpreter. The author of a web service does not design the processor, operating system, network stack, or database underneath it.

Software development has always been built on top of other people's intellectual work.

AI raises that dependency by another level.

The external intellectual tool can now do more than execute a prewritten library function. It can **create new pieces of a system for a specific task**.

So a more useful question is:

### Who decided what should be built?

Who decided the first version was bad?

Who noticed the interface was awkward?

Who changed the architecture after a test?

Who chose the acceptable trade-off between speed, cost, and reliability?

Who said, “No, that is not it. Do it again”?

AI performs an enormous amount of intellectual work. Pretending otherwise would be silly.

But the **will of the project** still belongs to the human, at least for now.

## A working result is not the same thing as good engineering

This is where the experienced developer is completely justified in saying, “Wait.”

There is a huge difference between:

> “It works on my machine.”

and

> “I understand why it works and under which conditions it will keep working.”

![It works, but why?](assets/04-it-works-but-why.avif "A working prototype can surprise even someone who knows all the reasons it should not have appeared this quickly")

AI can assemble something convincing very quickly. Sometimes the result is genuinely good. Sometimes the inside contains strange dependencies, duplicated logic, unnecessary abstraction layers, hidden states, or solutions that survive only because the current inputs happen to be friendly.

Outside: a polished application.

Inside: a tiny civilization holding the wires together with both hands.

![Polished outside, chaos inside](assets/05-polished-outside-chaos-inside.avif "A convincing interface says very little about the quality of the system behind it")

That is why a serious AI-native workflow cannot end with:

> “Look, it launched.”

It needs criteria that can be tested:

- reproducible startup;
- tests;
- failure cases;
- logging;
- load tests;
- security checks;
- understandable dependencies;
- observability;
- minimally sufficient documentation;
- a way to recover after failure.

The interesting part is that the human can ask AI to build this layer too.

For example:

> “I do not know how to test this properly. Try to break it. Create tests, find weak points, fix the obvious problems, and explain in plain language what risks remain.”

That does not eliminate the need for control.

It changes the form of control.

## The developer becomes less of an operator and more of a conductor

The classic model of programming assumed that the developer personally implemented a large part of the system.

AI-native development increasingly turns that work into orchestration.

One agent can write code. Another can review it. A third can create tests. A fourth can analyze performance. A fifth can prepare documentation. A sixth can research external documentation and dependencies.

![The developer as conductor of an AI orchestra](assets/06-ai-orchestra.avif "The human increasingly coordinates a whole loop of specialized AI helpers instead of individual lines of code")

In such a loop, the human looks less like a musician who must personally play every part.

They look more like a conductor.

A conductor does not need to play the cello better than the cellist. But they do need to hear when the cello enters at the wrong moment.

Likewise, an AI-native developer may not remember the exact syntax of a configuration file, but they must notice when the system behaves incorrectly.

That produces a new kind of competence:

### the ability to maintain a coherent model of the desired result.

How should the system behave?

Which states are acceptable?

Which failures are critical?

Which constraints are real?

What can be simplified?

How do we know the task is actually solved?

Those questions have always existed. The difference is that implementation used to consume much more of the developer's attention.

## One person can now cover part of the work of a small team

There is another reason old assumptions about development are starting to break.

Modern AI dramatically increases the productivity of a solo builder.

An idea that once might have needed several specialists could involve:

- a backend developer;
- a frontend developer;
- DevOps;
- a tester;
- a designer;
- a technical writer.

Today, one person can temporarily cover parts of those functions with models and specialized agents.

![A team and a solo builder](assets/07-team-vs-solo.avif "AI narrows the distance between a solo author and the capabilities of a small team")

That does not mean teams are going away.

Large products still require coordination, accountability, domain expertise, and long-term maintenance.

But **the minimum team size capable of producing a complex working product is getting smaller**.

This matters especially for people who previously could not enter software development at all.

They may be mechanics, designers, writers, engineers from another field, or simply people with a very specific problem.

They do not know “how it is normally done.”

And that is sometimes exactly why they ask questions a specialist stopped asking years ago.

## Then the prototype meets reality

Building a prototype and living with a system are different jobs.

After launch, users arrive.

Users press buttons in the wrong order.

The network drops between exactly the two operations you assumed were inseparable.

The data is not as clean as the test set.

An API changes its behavior.

Memory runs out.

Load lands somewhere nobody expected.

![Maintenance after launch](assets/08-maintenance-after-launch.avif "After the first launch comes a different kind of work: maintenance, observability, and real edge cases")

This is where years of engineering experience become an enormous advantage again.

An experienced specialist carries not only a catalog of ways to build systems, but also a **catalog of ways real systems die**.

So the productive future probably belongs neither to the pure vibe coder nor to the engineer who refuses AI on principle.

The stronger combination is someone willing to ask:

> “Why not try?”

and also capable of asking:

> “How do we prove this will not fall apart tomorrow?”

*The rabbit's machine left the workshop.*

*The first road went perfectly.*

*On the second, it rained.*

*On the third, a bridge had collapsed.*

*On the fourth, someone tried to put something in the trunk that should never have fit there.*

*That evening, the rabbit returned to the workshop exhausted.*

*The dog silently pulled out a chair and opened his notebook.*

*Now they repaired the machine together.*

## Not knowing can sometimes create freedom

Paradoxically, a lack of traditional training can occasionally become a temporary advantage.

An expert looks at a problem and sees constraints immediately.

They already know:

- this is expensive;
- this will be difficult to maintain;
- this is not how the architecture is normally done;
- similar attempts failed before;
- there will be too many edge cases.

Most of the time, they are right.

But real constraints can sometimes become mixed with historical ones.

“Nobody does it that way” gradually becomes “It cannot be done that way.”

That is where a beginner can accidentally become useful.

They do not yet know which questions are considered stupid.

![The wall of reality](assets/09-wall-of-reality.avif "Experience knows where the wall is. Inexperience may be the first to ask whether walking around it is mandatory")

So they start hitting the wall.

Sometimes it turns out to be load-bearing and should never have been touched.

Sometimes they simply hurt themselves.

And sometimes they discover a door nobody has used for years.

AI strengthens this effect because a beginner no longer has to spend years mastering every intermediate layer before testing an idea.

They can move through the loop very quickly:

> idea → implementation → error → change → verification.

That does not guarantee a good result.

But it dramatically lowers the cost of experimentation.

And when experiments become cheap, unexpected discoveries become more common.

## The new engineer does not have to choose between the rabbit and the dog

The argument about “vibe coders versus real programmers” is built on a false choice.

The vibe coder is useful precisely where they do not know why an idea is supposed to be impossible.

The experienced engineer is useful precisely where they know **why that idea might be dangerous**.

One brings freedom.

The other brings a map of the minefield.

The strongest result appears when those qualities exist in the same person or the same team.

![Two paths, one result](assets/10-two-paths-one-result.avif "Traditional engineering and AI-native development meet where a verifiable working system appears")

*Over time, the dog stopped beginning every conversation with “That is not how it is done.”*

*Instead he said, “All right. Show me what you want it to do.”*

*And the rabbit stopped ending work with “But it works.”*

*Instead he asked, “How are we going to try to break it?”*

*Somewhere between those two questions, a new workshop appeared.*

## Perhaps programming was never really the art of writing code

For a long time, code was the most precise way to tell a machine exactly what a human wanted.

To implement an idea, someone first had to translate it into a strict sequence of instructions.

Now a new translator exists between intent and execution.

It is imperfect.

It makes mistakes.

Sometimes it confidently builds nonsense.

Sometimes it produces structures that make an experienced engineer stare at the wall for a while.

But the abstraction level has already changed.

So a few years from now, the question:

> “Did you write all of this code yourself?”

may matter less than it does today.

Other questions may matter more:

> **Do you understand what you are building?**

> **Can you distinguish a working result from a convincing imitation?**

> **Can you formulate a task in a way that can actually be verified?**

> **Do you know what to do when reality behaves differently from what the model promised?**

And perhaps the central question of the new engineering era will be much simpler:

### Can you imagine something that does not yet exist, make it work, and recognize when it is working incorrectly?

If you can, then the argument over how many lines you personally typed may eventually matter far less than it seems to today.
