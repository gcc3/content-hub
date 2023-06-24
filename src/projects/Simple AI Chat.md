
Simple AI Chat
==============

Simple AI Chat is now avaiable at [simple-ai.io](https://simple-ai.io)

[old live demo](https://simple-ai-chat.gcc3.com).  

A dialogue application implemented based on OpenAI's API, the backend of which can be customizable.  

* Commands are supported  

Use `:help` to show commands.  

* Main features  

1. Session  
You can use `:info` to check current session ID, and attach session with `:session [session_id]` to continue previous talk.  
Use `:log` to show the current conversation history.  

2. Dictionary search  
A local dictionary will be used as `messages` to let AI reference to enhance the AI response quality.  
To check/add entry use `:entry list`, `:search [keyword]`, and `:entry add`.

3. Roleplay   
To use roleplay, samply type `:role use [role_name]`.  
Use `:role list` to check current avaiable roles.  
Promopts provided by the [Awesome ChatGPT Prompts](https://github.com/f/awesome-chatgpt-prompts)

4. Self Result Evaluation   
I found that the AI can evalute the result of itself very well.  
And this can solve credibility problem in dictionary search.  
To show the stats information which including the self result evaluation use `:stats on`.  

* Command-line run

1. Install `node` and `npm`  
2. Install [carbonyl](https://github.com/fathyb/carbonyl)  
`npm install --global carbonyl`  
3. Run `carbonyl https://simple-ai.io`  

Or use docker
1. Install docker
2. Run `docker run -ti fathyb/carbonyl https://simple-ai.io`  

Have fun!  

* Todos  

Extract keywords to imporve searching.  
AI links to AI.  
