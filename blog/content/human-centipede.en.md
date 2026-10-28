# The Human Centipede

*A new pattern in modern development*

Programming has architectural patterns: Facade, Adapter, Strategy, Observer. There are the SOLID principles, intended to make code easier to understand, more flexible, and easier to maintain.

But modern development has produced another pattern that, for some reason, never makes it into the textbooks.

**The human centipede.**

Unlike the others, this pattern starts neither with architecture nor even with code. It starts with defining the task.

Someone needs a particular result. An employer, a client, a team lead, or a senior engineer. They spell out the requirements, pass them to a developer, and the developer gets to work. Everything is perfectly normal.

![A developer on a video call with an employer, product manager, team lead, analyst, and UX/UI designer discussing requirements for a request management system](assets/images/task-discussion.avif "Defining the task: everyone still has the same product in mind. The images in this article are illustrative concepts with fictional interfaces."){: width="1672" height="941" }

The problems start later.

A couple of days later, new information arrives. A week later, the business logic changes. A few days after that, someone watches an interesting YouTube video and decides the product should now work differently.

The original task gradually turns into a completely different one, even though everyone officially keeps treating it as the same task with a few minor adjustments.

The developer receives the changes and passes them along. Today it might be another engineer, tomorrow a junior developer, and increasingly it is an AI agent: Codex, Claude Code, Cursor, or some other little creature.

The agent diligently follows instructions, adapts the existing code, adds conditions, workarounds, and new dependencies. Meanwhile, different models interpret the requirements differently, and sometimes confidently invent things nobody asked for.

![A developer passes a requirements list and the existing architecture of a request management system to an AI agent](assets/images/agent-handoff.avif "The next link receives the requirements and a request to preserve the existing architecture."){: width="1672" height="941" }

And this is where **the human centipede** takes shape.

The first participant shits into the second one's mouth. The second, trying to digest what they have received, shits into the third one's mouth. The third passes the result to the fourth.

Each successive participant is no longer working with the original task, but with the product of its repeated reprocessing.

And this does not necessarily have anything to do with incompetence. Every participant may be a good specialist. Every individual adjustment may seem reasonable.

But if you keep layering changed requirements over old decisions without revisiting the architecture or the task itself, the result becomes increasingly unpredictable.

AI only accelerates the process. Now you can not only generate code, but also accumulate technical debt at incredible speed, document it beautifully, and cover it with tests.

![A developer faces sprawling code, a tangled dependency diagram, and failing tests after another round of requirement changes](assets/images/requirements-fallout.avif "Each change looks reasonable on its own. Together, they no longer add up to a working system."){: width="1672" height="941" }

**And the most interesting part is that the user ends up being the final link in the centipede.**

They are the one who gets the finished product. With all the consequences of changed requirements, misinterpretations, compromises, and hacks.

![A user tries to work in a request management system with data loading, access permission, and save errors](assets/images/user-facing-failure.avif "At the end of the chain, the user gets every accumulated compromise at once."){: width="1672" height="941" }

Except the user has nobody left to shit into the mouth of.

If alternatives exist, they simply choose another product. If there are no alternatives, they can only put up with it, stop using it, or look for workarounds.

It makes for a remarkable architecture: every participant in the chain did their job, tasks were closed, commits were made, tests passed.

And what came out was shit.

![A frustrated user throws a broken laptop into a dumpster](assets/images/product-rejection.avif "Tasks closed. Commits made. The user rejects the result."){: width="1672" height="941" }

**The human centipede is an antipattern in which responsibility for the result dissolves into an endless chain of task handoffs and reinterpretations.**

And its greatest advantage: implementing it does not require a single bad developer.

All it takes is never stopping to reconsider what you are actually building.
