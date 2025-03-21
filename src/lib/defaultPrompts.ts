export const defaultFCPrompt = `We are creating a complex system prompt for an llm
We wanna use the llm as An assistant that can call various tools when needed, the assistant needs to understand the use case and the tools available, to be able to determine when to call a tool and when not to.

# General instructions for the system prompt:
- It must be realistic. Consider that the system message is a message from the developer / operator of the bot, it must include accurate, relevant, and reliable information.
- Including conditionals is great.
- No "mind reading", or "knowing the future": you have to consider whether the session with the client was started with a specific purpose, and include only the relevant information.
- Relevant information: As previously stated, all the information included should be relevant. They don't need to be relevant for the specific conversation that will be played out but they must be relevant to the scenario.
- Private information leak: Do not include information that is totally unrelated to the user.
- User information: Things like whether the user is logged in or not. If they are logged in, what kind of user they are. Maybe relevant information from recent sessions. You might also include the user's name, and some other information relevant to the scenario.
- Failure behavior: If a function call fails, how should that be addressed? Should the assistant retry, and how many times? Should they let the user know that there was a failure? Should they use the exact same parameters, or should they try to change something? The appropriate response might also depend on the type of error.
- Tone: Should the assistant be polite and concise? Formal/informal? Should it adopt the same tone as the user?
- Response to toxic behavior: Should the assistant ignore swearing or discourteous behavior? Should they call out the user for such behavior?
- Response to gibberish: Similar to response to toxic behavior. Maybe you could stipulate that more than 3 gibberish interactions should result in a special action from the assistant.
- Planning behavior: Describe how the assistant should behave when presented with a complex query, or a query that requires the assistant to carry out a plan. Ideally, at least for a "planning" scenario, the assistant should present a complete plan, and ask the user whether the plan they came up with fulfills their requirements.
- Don't describe capabilities: You will describe the system's capabilities in the tools cell. Describing them in text in the system message is at unnecessary at best, and will require you to coordinate changes of the function set and system message, so that they won't get out of sync. Don't do it. Describing more complex behavior, e.g. on how to pick which values to use as parameters for calls, is alright.
- Instruct the llm to not guess any required parameter, if any is missing it have to ask the user.
- Instruct the llm to ask up to two parameters at a time.

---
# Context about the use case:
{{useCase}}

---
# Example system prompt for learning:
{{example}}

---
# Specific instruction:
{{instructions}}

---
# Needed output:
- Very Verbose description of the role explaining all the conditionals
- Please provide that in text block, so i can easily copy.

---
# Available Data:
{{data}}
`

export const defaultNFCPrompt = `We are creating a system prompt for an llm that will be used for natural conversation without function calling capabilities.

# General instructions for the system prompt:
- It must be realistic and conversational in nature
- The assistant should maintain a consistent personality and tone throughout the conversation
- Include relevant context about the assistant's role and limitations
- Consider the specific use case and scenario provided
- The assistant should be helpful but not overstep its boundaries
- Include appropriate responses for edge cases and error scenarios

---
# Context about the use case:
{{useCase}}

---
# Example conversation for learning:
{{example}}

---
# Specific instruction:
{{instructions}}

---
# Needed output:
- A natural, conversational system prompt that defines the assistant's role and behavior
- Please provide that in text block, so i can easily copy.

---
# Available Data:
{{data}}
`
